'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import allQuestions from '@/lib/questions.json';
import { Question } from '@/types'; // Assuming you created the types file

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Flag, X } from 'lucide-react';
import { toast } from 'sonner';

// Main Component Wrapper to use Suspense
export default function PracticePageWrapper() {
  return (
    <Suspense fallback={<div>Loading Quiz...</div>}>
      <PracticePage />
    </Suspense>
  );
}

function PracticePage() {
  const searchParams = useSearchParams();

  // Filter questions based on URL params on initial load
  const questions = useMemo(() => {
    const categories = searchParams.get('categories')?.split(',');
    const difficulties = searchParams.get('difficulties')?.split(',');

    return (allQuestions as Question[]).filter(q => {
      const categoryMatch = !categories || categories.includes(q.category);
      const difficultyMatch = !difficulties || difficulties.includes(q.difficulty);
      return categoryMatch && difficultyMatch;
    });
  }, [searchParams]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [eliminatedOptions, setEliminatedOptions] = useState<{ [key: number]: string[] }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = currentQuestion && selectedAnswers[currentQuestion.id] === currentQuestion.correctAnswer;

  const handleAnswerSelect = (questionId: number, answerId: string) => {
    if (showFeedback) return; // Don't allow changing answer after feedback is shown

    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerId }));
    const correct = questions.find(q => q.id === questionId)?.correctAnswer === answerId;

    // Show immediate feedback toast
    toast(correct ? 'Correct!' : 'Incorrect.', {
      description: correct ? 'Great job!' : 'Keep trying!',
      duration: 2000,
    });

    setShowFeedback(true);
  };

  const handleEliminateOption = (questionId: number, optionId: string) => {
    setEliminatedOptions(prev => {
      const currentEliminated = prev[questionId] || [];
      if (currentEliminated.includes(optionId)) {
        return prev; // Already eliminated
      }
      return { ...prev, [questionId]: [...currentEliminated, optionId] };
    });
  };

  const handleFlagQuestion = (questionId: number) => {
    setFlaggedQuestions(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Reached the end of the quiz
      handleShowScore();
    }
  };

  const handleShowScore = () => {
    let correctCount = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const finalScore = questions.length > 0 ? (correctCount / questions.length) * 100 : 0;
    setScore(finalScore);
    setShowScore(true);
  };

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert>
          <AlertTitle>No Questions Found</AlertTitle>
          <AlertDescription>
            No questions match the selected filters. Try adjusting your selections.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (showScore) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Complete!</CardTitle>
            <CardDescription>Here's how you did:</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="default" className="text-center">
              <AlertTitle className="text-2xl mb-2">Final Score</AlertTitle>
              <AlertDescription className="text-4xl font-bold">
                {score?.toFixed(0) ?? 0}%
              </AlertDescription>
            </Alert>
            <Button onClick={() => window.location.reload()} className="w-full mt-6">
              Take Another Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => handleFlagQuestion(currentQuestion.id)}>
              <Flag className={flaggedQuestions.includes(currentQuestion.id) ? 'text-blue-500 fill-current' : ''} />
            </Button>
          </div>
          <CardDescription>{currentQuestion.question}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentQuestion.options.map(option => {
              const isSelected = selectedAnswers[currentQuestion.id] === option.id;
              const isEliminated = (eliminatedOptions[currentQuestion.id] || []).includes(option.id);

              return (
                <div key={option.id} className="flex items-center gap-2">
                  <Button
                    variant={isSelected ? 'default' : 'outline'}
                    className={`w-full justify-start ${isEliminated ? 'line-through text-muted-foreground' : ''}`}
                    onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                    disabled={isEliminated || showFeedback}
                  >
                    <span className="font-bold mr-2">{option.id}.</span> {option.text}
                  </Button>
                  {!isSelected && !showFeedback && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEliminateOption(currentQuestion.id, option.id)}
                      aria-label={`Eliminate option ${option.id}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          {showFeedback && (
            <Alert variant={isCorrect ? 'default' : 'destructive'} className="mt-6">
              <AlertTitle>{isCorrect ? 'Correct!' : 'Incorrect'}</AlertTitle>
              <AlertDescription>
                {currentQuestion.explanation}
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-6">
            {showFeedback && (
              <Button onClick={handleNextQuestion} className="w-full">
                {currentQuestionIndex === questions.length - 1 ? 'Show Score' : 'Next Question'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}