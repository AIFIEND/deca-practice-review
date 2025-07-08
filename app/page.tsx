import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold">DECA Exam Practice</h1>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  DECA Exam Practice
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Prepare for your DECA competition with our comprehensive practice questions. Test your business
                  knowledge and improve your exam skills.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/practice">
                  <Button size="lg" className="h-12 px-8">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Start Practicing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Multiple Choice Questions</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Practice with realistic DECA-style multiple choice questions covering various business concepts.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Instant Feedback</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Receive immediate feedback on your answers with explanations to help you learn and improve.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Track Your Progress</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Monitor your performance and review flagged questions to focus on areas that need improvement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © 2025 DECA Exam Practice. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
