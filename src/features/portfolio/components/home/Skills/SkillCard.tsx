"use client"

import { useEffect, useState } from "react"

interface SkillCardProps {
  name: string
  percentage: number
}

const SkillCard = ({ name, percentage }: SkillCardProps) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage)
    }, 500)

    return () => clearTimeout(timer)
  }, [percentage])

  const circumference = 2 * Math.PI * 45 // radius of 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference

  return (
    <div className="bg-foreground/5 rounded-xl p-6 flex flex-col items-center space-y-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-foreground/5"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="text-primary transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-semibold text-muted-foreground">{animatedPercentage}%</span>
        </div>
      </div>
      <h3 className="text-center text-base font-medium text-foreground max-w-32">{name}</h3>
    </div>
  )
}

export default SkillCard
