"use client"

/**
 * Error Boundary Component
 * Catches React errors and displays fallback UI instead of white screen
 * Prevents entire app crash when component errors occur
 */

import { Component, ReactNode } from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { Button } from "@pet-to-you/ui"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onReset?: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: { componentStack: string }
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: undefined, errorInfo: undefined }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    // Log error to error reporting service (e.g., Sentry)
    console.error("ErrorBoundary caught an error:", error, errorInfo)
    this.setState({ errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
              {/* Error icon */}
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>

              {/* Error message */}
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-gray-900">
                  오류가 발생했습니다
                </h2>
                <p className="text-gray-600 text-sm">
                  페이지를 불러오는 중 문제가 발생했습니다.
                  <br />
                  잠시 후 다시 시도해주세요.
                </p>
              </div>

              {/* Error details (only in development) */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="bg-gray-50 rounded-lg p-4 text-xs">
                  <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                    오류 상세 정보 (개발 모드)
                  </summary>
                  <div className="space-y-2 text-gray-600">
                    <div>
                      <strong>Error:</strong>
                      <pre className="mt-1 whitespace-pre-wrap break-all">
                        {this.state.error.message}
                      </pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="mt-1 whitespace-pre-wrap text-[10px]">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={this.handleReset}
                  className="flex-1"
                  variant="default"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  다시 시도
                </Button>
                <Button
                  onClick={() => (window.location.href = "/")}
                  className="flex-1"
                  variant="outline"
                >
                  <Home className="h-4 w-4 mr-2" />
                  홈으로
                </Button>
              </div>

              {/* Support info */}
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  문제가 계속되면 시스템 관리자에게 문의하세요
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Hook-based error boundary for simpler usage
 * Usage: Wrap components that might throw errors
 *
 * @example
 * <ErrorBoundary>
 *   <DashboardPage />
 * </ErrorBoundary>
 */
