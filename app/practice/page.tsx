"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { AnswerChoice } from "@/components/answer-choice"
import { FlagButton } from "@/components/flag-button"
import { ProgressBar } from "@/components/progress-bar"
import { useQuestionStore } from "@/hooks/use-question-store"
import { questions } from "@/lib/questions"

interface QuestionState {
  selectedChoiceId: string | null
  isAnswered: boolean
  isCorrect: boolean | null
  explanation: string | null
}

export default function PracticePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questionStates, setQuestionStates] = useState<Record<string, QuestionState>>({})

  const { answers, eliminatedOptions, flaggedIds, attempts, toggleEliminate, toggleFlag, recordAnswer } =
    useQuestionStore()

  const currentQuestion = questions[currentQuestionIndex]
  const currentQuestionId = currentQuestion.id.toString()
  const answeredCount = Object.keys(answers).length

  const currentState = questionStates[currentQuestionId] || {
    selectedChoiceId: null,
    isAnswered: false,
    isCorrect: null,
    explanation: null,
  }

  const handleAnswerSelect = (choiceId: string) => {
    if (currentState.isAnswered) return

    const isCorrect = choiceId === currentQuestion.correctAnswer
    const newState: QuestionState = {
      selectedChoiceId: choiceId,
      isAnswered: true,
      isCorrect,
      explanation: currentQuestion.explanation,
    }

    setQuestionStates((prev) => ({
      ...prev,
      [currentQuestionId]: newState,
    }))

    recordAnswer(currentQuestionId, choiceId)

    toast({
      title: isCorrect ? "Correct!" : "Incorrect",
      description: currentQuestion.explanation,
      variant: isCorrect ? "default" : "destructive",
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = () => {
    const correctAnswers = Object.entries(answers).filter(([questionId, answer]) => {
      const question = questions.find((q) => q.id.toString() === questionId)
      return question && answer === question.correctAnswer
    }).length

    const score = Math.round((correctAnswers / Object.keys(answers).length) * 100)

    const params = new URLSearchParams({
      score: score.toString(),
      correct: correctAnswers.toString(),
      total: Object.keys(answers).length.toString(),
      flagged: flaggedIds.join(","),
    })

    router.push(`/results?${params.toString()}`)
  }

  const currentEliminated = eliminatedOptions[currentQuestionId] || []
  const isFlagged = flaggedIds.includes(currentQuestionId)

  return (
    <div className="min-h-screen bg-background">
      <ProgressBar current={answeredCount} total={questions.length} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <FlagButton isFlagged={isFlagged} onToggle={() => toggleFlag(currentQuestionId)} />
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">{currentQuestion.stem}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(currentQuestion.options).map(([key, value]) => {
                  const isThisChoice = currentState.selectedChoiceId === key
                  const isCorrectChoice = key === currentQuestion.correctAnswer
                  const showCorrectness = currentState.isAnswered && (isThisChoice || isCorrectChoice)

                  return (
                    <AnswerChoice
                      key={key}
                      text={`${key}. ${value}`}
                      isEliminated={currentEliminated.includes(key)}
                      isAnswered={currentState.isAnswered}
                      isCorrect={showCorrectness ? isCorrectChoice : undefined}
                      explanation={showCorrectness ? currentQuestion.explanation : undefined}
                      onToggleEliminate={() => toggleEliminate(currentQuestionId, key)}
                      onSelect={() => handleAnswerSelect(key)}
                    />
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              aria-label="Previous question"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex gap-2">
              {answeredCount === questions.length ? (
                <Button onClick={handleSubmit} aria-label="Submit quiz">
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1 || !currentState.isAnswered}
                  aria-label="Next question"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
