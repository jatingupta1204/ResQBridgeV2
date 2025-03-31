import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/Header"

export default function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email")
    const password = formData.get("password")

    try {
      const res = await fetch("http://localhost:5000/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "login",
          email,
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "An error occurred")
      }

      navigate("/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <Header />
    <div className="container max-w-md mx-auto px-4 py-8">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email and password to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-sm text-muted-foreground text-center">
            <a href="/forgot-password" className="hover:text-primary">
              Forgot your password?
            </a>
          </div>
          <div className="text-sm text-muted-foreground text-center">
            Don't have an account?{" "}
            <a href="/register" className="hover:text-primary">
              Sign up
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
    </>
  )
}
