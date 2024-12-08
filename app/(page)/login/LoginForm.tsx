"use client"

import { useActionState, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/ui/icons"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { LoginSchema, loginSchema } from "@/lib/schemas"
import { login } from "./actions"
import { useFormStatus } from "react-dom"

export default function RegistrationPage() {
    const [state, loginAction] = useActionState(login, undefined);
    const [isLoading, setLoading] = useState<boolean>(false)
    
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginSchema) {
    setLoading(true)
    // Cria o objeto FormData
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    loginAction(formData);
    
    setLoading(false);
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-1 gap-0">
      {/* Left Column - Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
            <p className="text-sm text-muted-foreground">
              Join our 100% free creative network.
            </p>
          </div>

          <div className="space-y-4">
            <Button variant="outline" className="w-full" type="button">
              <Icons.google className="mr-2 h-4 w-4" />
              Sign up with Google
            </Button>
            <Button variant="outline" className="w-full" type="button">
              <Icons.twitter className="mr-2 h-4 w-4" />
              Sign up with X
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">OR</span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Create a password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SubmitButton isLoading={isLoading}/>
              </form>
            </Form>
          </div>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <a href="/login" className="underline underline-offset-4 hover:text-primary">
              Log in
            </a>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            By creating an account, you agree to our{" "}
            <a href="/terms" className="underline underline-offset-4 hover:text-primary">
              terms of use
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function SubmitButton({
    isLoading
}: {
    isLoading: boolean
}) {
    const { pending } = useFormStatus();
  
    return (
      <Button className="w-full" disabled={pending} type="submit">
        {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        )}
        Entrar
      </Button>
    );
  }
