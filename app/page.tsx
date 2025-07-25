"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  Link2,
  Copy,
  QrCode,
  BarChart3,
  ExternalLink,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Calendar,
  TrendingUp,
  Zap,
  ArrowRight,
  MousePointer,
  Sparkles,
  Rocket,
  Shield,
  Users,
  Target,
  Star,
} from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

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

export default function LinkShortener() {
  const [originalUrl, setOriginalUrl] = useState("")
  const [customSlug, setCustomSlug] = useState("")
  const [shortenedLinks, setShortenedLinks] = useState<ShortenedLink[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedLinks = localStorage.getItem("shortenedLinks")
    if (savedLinks) {
      try {
        const links = JSON.parse(savedLinks)
        setShortenedLinks(links)
      } catch (error) {
        console.error("Error loading saved links:", error)
      }
    }
  }, [])

  // Save to localStorage whenever shortenedLinks changes
  useEffect(() => {
    if (shortenedLinks.length > 0) {
      localStorage.setItem("shortenedLinks", JSON.stringify(shortenedLinks))
    }
  }, [shortenedLinks])

  const generateShortCode = (): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url.startsWith("http") ? url : `https://${url}`)
      return true
    } catch {
      return false
    }
  }

  const handleShortenUrl = async () => {
    if (!originalUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL to shorten",
        variant: "destructive",
      })
      return
    }

    if (!isValidUrl(originalUrl)) {
      toast({
        title: "Error",
        description: "Please enter a valid URL (e.g., https://example.com)",
        variant: "destructive",
      })
      return
    }

    if (customSlug && shortenedLinks.some((link) => link.customSlug === customSlug || link.shortCode === customSlug)) {
      toast({
        title: "Error",
        description: "This custom slug is already taken",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const shortCode = customSlug || generateShortCode()
      const newLink: ShortenedLink = {
        id: Date.now().toString(),
        originalUrl: originalUrl.startsWith("http") ? originalUrl : `https://${originalUrl}`,
        shortCode,
        customSlug: customSlug || undefined,
        createdAt: new Date().toISOString(),
        clicks: 0,
        analytics: [],
      }

      setShortenedLinks((prev) => [newLink, ...prev])
      setOriginalUrl("")
      setCustomSlug("")

      toast({
        title: "🎉 Success!",
        description: "Link shortened successfully! Click the short link below to test it.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to shorten link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyToClipboard = async (shortCode: string) => {
    const shortUrl = `${window.location.origin}/${shortCode}`
    try {
      await navigator.clipboard.writeText(shortUrl)
      toast({
        title: "✅ Copied!",
        description: "Short URL copied to clipboard",
      })
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea")
      textArea.value = shortUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)

      toast({
        title: "✅ Copied!",
        description: "Short URL copied to clipboard",
      })
    }
  }

  const handleTestRedirect = (shortCode: string) => {
    const shortUrl = `${window.location.origin}/${shortCode}`
    window.open(shortUrl, "_blank")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "mobile":
        return <Smartphone className="h-4 w-4" />
      case "tablet":
        return <Tablet className="h-4 w-4" />
      case "desktop":
        return <Monitor className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-32">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="relative">
                <Link2 className="h-12 w-12 text-blue-600 animate-bounce" />
                <Sparkles className="h-6 w-6 text-purple-500 absolute -top-2 -right-2 animate-spin" />
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                LinkShrink
              </h1>
            </div>
            <p className="text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Transform your long URLs into powerful, trackable short links with
              <span className="text-blue-600 font-semibold"> advanced analytics</span> and
              <span className="text-purple-600 font-semibold"> beautiful QR codes</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{shortenedLinks.length}+</div>
                <div className="text-slate-600">Links Created</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {shortenedLinks.reduce((sum, link) => sum + link.clicks, 0)}+
                </div>
                <div className="text-slate-600">Total Clicks</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
                <div className="text-slate-600">Uptime</div>
              </div>
            </div>

            <Button
              size="lg"
              className="h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={() => document.getElementById("url-shortener")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Rocket className="h-5 w-5 mr-2" />
              Get Started Free
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Why Choose <span className="text-blue-600">LinkShrink</span>?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Powerful features designed to make your link sharing experience seamless and insightful
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="h-8 w-8 text-yellow-500" />,
                title: "Lightning Fast",
                description: "Generate short links instantly with our optimized algorithms",
              },
              {
                icon: <BarChart3 className="h-8 w-8 text-blue-500" />,
                title: "Advanced Analytics",
                description: "Track clicks, devices, and user behavior in real-time",
              },
              {
                icon: <QrCode className="h-8 w-8 text-purple-500" />,
                title: "QR Code Generation",
                description: "Automatically generate beautiful QR codes for every short link",
              },
              {
                icon: <Shield className="h-8 w-8 text-green-500" />,
                title: "Secure & Reliable",
                description: "Enterprise-grade security with 99.9% uptime guarantee",
              },
              {
                icon: <Target className="h-8 w-8 text-red-500" />,
                title: "Custom Branding",
                description: "Use custom slugs to match your brand identity",
              },
              {
                icon: <Users className="h-8 w-8 text-indigo-500" />,
                title: "Easy Sharing",
                description: "Share your links across all platforms seamlessly",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0"
              >
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* URL Shortener Section */}
      <div id="url-shortener" className="py-24">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-slate-800">
              Start Shortening <span className="text-blue-600">Now</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Transform your long URLs into short, shareable links in seconds
            </p>
          </div>

          {/* URL Shortener Form */}
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <Link2 className="h-6 w-6 text-blue-600" />
                <span>Shorten Your URL</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="original-url" className="text-lg font-medium">
                  Enter your long URL
                </Label>
                <Input
                  id="original-url"
                  type="url"
                  placeholder="https://example.com/very-long-url-that-needs-shortening"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  className="h-14 text-lg border-2 focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-slug" className="text-lg font-medium">
                  Custom slug (optional)
                </Label>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500 whitespace-nowrap font-mono bg-slate-100 px-3 py-3 rounded-lg">
                    {typeof window !== "undefined" ? window.location.host : "localhost:3000"}/
                  </span>
                  <Input
                    id="custom-slug"
                    placeholder="my-custom-link"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value.replace(/[^a-zA-Z0-9-]/g, ""))}
                    className="flex-1 h-14 text-lg border-2 focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <Button
                onClick={handleShortenUrl}
                disabled={isLoading}
                className="w-full h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Shortening...
                  </>
                ) : (
                  <>
                    <Zap className="h-6 w-6 mr-3" />
                    Shorten URL
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Shortened Links Section */}
      {shortenedLinks.length > 0 && (
        <div className="py-16 bg-slate-50/50">
          <div className="max-w-4xl mx-auto px-4 space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-800 flex items-center justify-center space-x-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <span>Your Shortened Links</span>
              </h2>
              <p className="text-slate-600 mt-2">Click on any short link to test the redirect!</p>
            </div>

            <div className="grid gap-6">
              {shortenedLinks.map((link, index) => (
                <Card
                  key={link.id}
                  className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      {/* Original URL */}
                      <div className="space-y-2">
                        <Label className="text-sm text-slate-500 uppercase tracking-wide font-semibold">
                          Original URL
                        </Label>
                        <p className="text-slate-700 break-all bg-slate-50 p-3 rounded-lg">{link.originalUrl}</p>
                      </div>

                      {/* Short URL */}
                      <div className="space-y-3">
                        <Label className="text-sm text-slate-500 uppercase tracking-wide font-semibold">
                          Short URL (Click to Test!)
                        </Label>
                        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-100">
                          <button
                            onClick={() => handleTestRedirect(link.shortCode)}
                            className="flex-1 text-left text-blue-600 font-mono text-lg font-semibold hover:text-blue-800 transition-colors cursor-pointer underline"
                          >
                            {window.location.origin}/{link.shortCode}
                          </button>
                          <Button
                            size="sm"
                            onClick={() => handleCopyToClipboard(link.shortCode)}
                            className="shrink-0 bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
                        <div className="flex items-center space-x-4">
                          <Badge variant="secondary" className="flex items-center space-x-2 px-3 py-1">
                            <BarChart3 className="h-4 w-4" />
                            <span className="font-semibold">{link.clicks} clicks</span>
                          </Badge>
                          <div className="flex items-center space-x-2 text-sm text-slate-500">
                            <Calendar className="h-4 w-4" />
                            <span>Created {formatDate(link.createdAt)}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTestRedirect(link.shortCode)}
                            className="flex items-center space-x-2 hover:bg-green-50 hover:border-green-300 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span>Test Link</span>
                          </Button>

                          {/* QR Code Dialog */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="hover:bg-purple-50 hover:border-purple-300 transition-colors bg-transparent"
                              >
                                <QrCode className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle className="flex items-center space-x-2">
                                  <QrCode className="h-5 w-5" />
                                  <span>QR Code</span>
                                </DialogTitle>
                              </DialogHeader>
                              <div className="flex flex-col items-center space-y-6">
                                <div className="p-6 bg-white rounded-xl shadow-inner">
                                  <QRCodeSVG
                                    value={`${window.location.origin}/${link.shortCode}`}
                                    size={200}
                                    level="M"
                                    includeMargin
                                  />
                                </div>
                                <p className="text-sm text-center text-slate-600 max-w-sm">
                                  Scan this QR code with any smartphone camera to access your shortened link instantly
                                </p>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {/* Analytics Dialog */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="hover:bg-blue-50 hover:border-blue-300 transition-colors bg-transparent"
                              >
                                <BarChart3 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-3xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center space-x-2">
                                  <BarChart3 className="h-5 w-5" />
                                  <span>Analytics Dashboard</span>
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-8">
                                {/* Stats Overview */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                                    <CardContent className="p-6 text-center">
                                      <div className="text-3xl font-bold text-blue-600 mb-2">{link.clicks}</div>
                                      <div className="text-sm text-blue-700 font-medium">Total Clicks</div>
                                    </CardContent>
                                  </Card>
                                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                                    <CardContent className="p-6 text-center">
                                      <div className="text-3xl font-bold text-green-600 mb-2">
                                        {new Set(link.analytics.map((a) => a.device)).size || 0}
                                      </div>
                                      <div className="text-sm text-green-700 font-medium">Device Types</div>
                                    </CardContent>
                                  </Card>
                                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                                    <CardContent className="p-6 text-center">
                                      <div className="text-3xl font-bold text-purple-600 mb-2">
                                        {link.analytics.length > 0
                                          ? Math.round(
                                              link.clicks /
                                                Math.max(
                                                  1,
                                                  Math.ceil(
                                                    (Date.now() - new Date(link.createdAt).getTime()) /
                                                      (1000 * 60 * 60 * 24),
                                                  ),
                                                ),
                                            )
                                          : 0}
                                      </div>
                                      <div className="text-sm text-purple-700 font-medium">Avg. Daily Clicks</div>
                                    </CardContent>
                                  </Card>
                                </div>

                                <Separator />

                                {/* Recent Activity */}
                                <div className="space-y-4">
                                  <h4 className="font-semibold flex items-center space-x-2 text-lg">
                                    <Calendar className="h-5 w-5" />
                                    <span>Recent Activity</span>
                                  </h4>
                                  <div className="max-h-80 overflow-y-auto space-y-3">
                                    {link.analytics.length === 0 ? (
                                      <div className="text-center py-12">
                                        <MousePointer className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-500 text-lg">No clicks yet</p>
                                        <p className="text-slate-400">Click the short link above to test it!</p>
                                      </div>
                                    ) : (
                                      link.analytics
                                        .slice()
                                        .reverse()
                                        .map((activity, index) => (
                                          <div
                                            key={index}
                                            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                                          >
                                            <div className="flex items-center space-x-4">
                                              <div className="p-2 bg-white rounded-lg shadow-sm">
                                                {getDeviceIcon(activity.device)}
                                              </div>
                                              <div>
                                                <div className="font-medium capitalize text-slate-800">
                                                  {activity.device}
                                                </div>
                                                <div className="text-sm text-slate-500">
                                                  {formatDate(activity.timestamp)}
                                                </div>
                                              </div>
                                            </div>
                                            <Badge variant="outline" className="bg-white">
                                              Click #{link.analytics.length - index}
                                            </Badge>
                                          </div>
                                        ))
                                    )}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Testimonials Section */}
      <div className="py-24 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Loved by <span className="text-blue-600">Thousands</span>
            </h2>
            <p className="text-xl text-slate-600">See what our users are saying about LinkShrink</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Marketing Manager",
                company: "TechCorp",
                avatar: "/assets/SarahJhonson.png?height=60&width=60&text=SJ",
                content:
                  "LinkShrink has revolutionized how we track our marketing campaigns. The analytics are incredibly detailed!",
                rating: 5,
              },
              {
                name: "Mike Chen",
                role: "Social Media Specialist",
                company: "Creative Agency",
                avatar: "/assets/MikeChen.png?height=60&width=60&text=MC",
                content:
                  "The QR code feature is a game-changer for our offline marketing. Super easy to use and track!",
                rating: 5,
              },
              {
                name: "Emily Rodriguez",
                role: "Content Creator",
                company: "Freelancer",
                avatar: "/assets/EmilyRodriguez.png?height=60&width=60&text=ER",
                content:
                  "I love the custom slugs feature. It helps maintain my brand consistency across all platforms.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-0"
              >
                <CardContent className="p-8">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 italic">{testimonial.content}</p>
                  <div className="flex items-center space-x-4">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="font-semibold text-slate-800">{testimonial.name}</div>
                      <div className="text-sm text-slate-500">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Link2 className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">LinkShrink</span>
              </div>
              <p className="text-slate-400">
                The most powerful URL shortener with advanced analytics and beautiful QR codes.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-slate-400">
                <li>URL Shortening</li>
                <li>Custom Slugs</li>
                <li>QR Codes</li>
                <li>Analytics</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-slate-400">
                <li>Twitter</li>
                <li>LinkedIn</li>
                <li>GitHub</li>
                <li>Support</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2025 LinkShrink. Built with ❤️ by Mohammed Bilal</p>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  )
}
