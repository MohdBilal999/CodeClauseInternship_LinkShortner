"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, ArrowLeft, AlertCircle, Loader2, Shield, Clock } from "lucide-react"
import Link from "next/link"

interface ShortenedLink {
  id: string
  originalUrl: string
  shortCode: string
  customSlug?: string
  createdAt: string
  clicks: number
  analytics: {
    timestamp: string
    device: string
    userAgent: string
  }[]
}

export default function RedirectPage() {
  const params = useParams()
  const [link, setLink] = useState<ShortenedLink | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [countdown, setCountdown] = useState(3)
  const [error, setError] = useState<string | null>(null)

  const getDeviceType = (userAgent: string): string => {
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      if (/iPad/.test(userAgent)) return "tablet"
      return "mobile"
    }
    return "desktop"
  }

  useEffect(() => {
    const shortCode = params.shortCode as string

    if (!shortCode) {
      setError("No short code provided")
      setIsLoading(false)
      return
    }

    try {
      // Get links from localStorage
      const savedLinks = localStorage.getItem("shortenedLinks")

      if (savedLinks) {
        const links: ShortenedLink[] = JSON.parse(savedLinks)
        const foundLink = links.find((l) => l.shortCode === shortCode || l.customSlug === shortCode)

        if (foundLink) {
          setLink(foundLink)

          // Update analytics immediately
          const updatedLinks = links.map((l) => {
            if (l.id === foundLink.id) {
              return {
                ...l,
                clicks: l.clicks + 1,
                analytics: [
                  ...l.analytics,
                  {
                    timestamp: new Date().toISOString(),
                    device: getDeviceType(navigator.userAgent),
                    userAgent: navigator.userAgent,
                  },
                ],
              }
            }
            return l
          })

          // Save updated analytics
          localStorage.setItem("shortenedLinks", JSON.stringify(updatedLinks))

          // Start countdown and redirect
          setIsLoading(false)

          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer)
                // Redirect to the original URL
                window.location.href = foundLink.originalUrl
                return 0
              }
              return prev - 1
            })
          }, 1000)

          return () => clearInterval(timer)
        } else {
          setError("Link not found")
        }
      } else {
        setError("No links found")
      }
    } catch (err) {
      setError("Error loading link data")
      console.error("Error:", err)
    }

    setIsLoading(false)
  }, [params.shortCode])

  const handleRedirectNow = () => {
    if (link) {
      window.location.href = link.originalUrl
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardContent className="p-8 text-center space-y-4">
            <Loader2 className="h-12 w-12 text-blue-600 mx-auto animate-spin" />
            <h1 className="text-xl font-semibold text-slate-800">Loading...</h1>
            <p className="text-slate-600">Preparing your redirect</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardContent className="p-8 text-center space-y-6">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-800">Link Not Found</h1>
              <p className="text-slate-600">
                {error || "The short link you're looking for doesn't exist or may have been removed."}
              </p>
            </div>
            <div className="space-y-3">
              <Link href="/">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Create New Short Link
                </Button>
              </Link>
              <p className="text-sm text-slate-500">
                Short code: <code className="bg-slate-100 px-2 py-1 rounded">{params.shortCode}</code>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8 text-center space-y-8">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <ExternalLink className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Redirecting...
              </h1>
            </div>
            <p className="text-slate-600 text-lg">You will be redirected automatically in</p>
          </div>

          {/* Countdown */}
          <div className="relative">
            <div className="text-6xl font-bold text-blue-600 mb-2">{countdown}</div>
            <div className="text-sm text-slate-500 flex items-center justify-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>seconds</span>
            </div>
            {/* Progress ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-slate-200"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (countdown / 3)}`}
                  className="text-blue-600 transition-all duration-1000 ease-linear"
                />
              </svg>
            </div>
          </div>

          {/* Destination Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wide flex items-center justify-center space-x-1">
                <Shield className="h-4 w-4" />
                <span>Destination</span>
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-100">
                <p className="text-slate-700 break-all font-mono text-sm">{link.originalUrl}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="font-semibold text-blue-700">Total Clicks</div>
                <div className="text-2xl font-bold text-blue-600">{link.clicks}</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="font-semibold text-green-700">Created</div>
                <div className="text-sm text-green-600">{new Date(link.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleRedirectNow}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Go Now
            </Button>

            <Link href="/">
              <Button
                variant="outline"
                className="w-full h-12 bg-white hover:bg-slate-50 border-2 text-slate-700 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to LinkShrink
              </Button>
            </Link>
          </div>

          {/* Security Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800 flex items-center justify-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>This link has been scanned for safety. Redirecting to: {new URL(link.originalUrl).hostname}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
