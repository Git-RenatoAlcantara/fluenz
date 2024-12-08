"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Icons } from "@/components/ui/icons";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { RegistrationData, registrationSchema } from "@/lib/schemas";
import { register } from "./actions"

import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from "@/hooks/use-toast";
import { RotateCcw } from "lucide-react";

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [state, registerAction] = useActionState(register, undefined);
  const { toast } = useToast();

  const form = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: RegistrationData) {
    setIsLoading(true)
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);

    registerAction(formData);

    setIsLoading(false)
  }

  useEffect(() => {
    if(state?.errors){
      const errors = state.errors 
      const keys = Object.keys(errors)
    
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      })
    }
  }, [state])
  
  return (
       <div className="min-h-screen grid lg:grid-cols-1 gap-0">
      {/* Left Column - Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl text-center font-semibold tracking-tight">Crie sua conta</h1>
            <p className="text-sm text-center text-muted-foreground">
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o seu nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Digite o seu email" {...field} />
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
                        <Input type="password" placeholder="Crie uma senha" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SubmitButton isLoading={isLoading} />
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
  );
}


function SubmitButton({
  isLoading
}: {
  isLoading: boolean
}){

  return (
    <Button className="w-full" disabled={isLoading} type="submit">
      {isLoading && (
        <RotateCcw className="animate-spin" />
      )}
      Entrar
    </Button>
  )
}