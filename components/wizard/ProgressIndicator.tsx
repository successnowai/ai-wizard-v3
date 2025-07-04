'use client'
import { CheckCircle } from 'lucide-react'
import { WIZARD_STEPS } from '@/utils/constants'

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-between max-w-6xl mx-auto overflow-x-auto pb-4">
      {WIZARD_STEPS.map((step, index) => {
        const stepNumber = step.stepNumber
        const isCompleted = stepNumber < currentStep
        const isCurrent = stepNumber === currentStep
        const isUpcoming = stepNumber > currentStep

        return (
          <div key={stepNumber} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center min-w-[120px]">
              <div
                className={`
                  w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-300
                  ${isCompleted ? 'bg-green-500 border-green-500 text-white' :
                    isCurrent ? 'bg-bright-blue border-bright-blue text-white' :
                    'bg-white border-gray-300 text-gray-400'}
                `}
              >
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <span className="text-2xl">{step.icon}</span>
                )}
              </div>
              
              {/* Step Label */}
              <div className="mt-2 text-center">
                <div className={`text-sm font-medium ${isCurrent ? 'text-bright-blue' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-400 mt-1 max-w-[100px] leading-tight">
                  {step.description}
                </div>
              </div>
            </div>

            {/* Connector Line */}
            {index < WIZARD_STEPS.length - 1 && (
              <div className="flex-1 mx-4 mb-8">
                <div
                  className={`h-1 rounded transition-all duration-300 ${
                    stepNumber < currentStep ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                  style={{ minWidth: '40px' }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
