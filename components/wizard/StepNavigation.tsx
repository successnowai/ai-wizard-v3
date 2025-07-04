'use client'
import { ArrowLeft, ArrowRight, Save } from 'lucide-react'

interface StepNavigationProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
  isLoading: boolean
  canProceed: boolean
}

export function StepNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isLoading,
  canProceed
}: StepNavigationProps) {
  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === totalSteps

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between">
        {/* Previous Button */}
        <button
          onClick={onPrevious}
          disabled={isFirstStep || isLoading}
          className="btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {isFirstStep ? 'Back to Projects' : 'Previous Step'}
        </button>

        {/* Step Info */}
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">
            Step {currentStep} of {totalSteps}
          </div>
          <div className="w-48 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-bright-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          disabled={!canProceed || isLoading}
          className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="spinner mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              {isLastStep ? 'Complete Project' : 'Next Step'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-4 text-center text-sm text-gray-500">
        {!canProceed ? (
          <p className="text-red-500">Please fill out all required fields to continue</p>
        ) : isLastStep ? (
          <p>Ready to generate your comprehensive development brief</p>
        ) : (
          <p>Your progress is automatically saved as you complete each step</p>
        )}
      </div>
    </div>
  )
}
