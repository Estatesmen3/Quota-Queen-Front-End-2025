
import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Building, User, Timer, Award, Sparkles } from "lucide-react";

const formSchema = z.object({
  timeLimit: z.string().min(1, { message: "Please set a time limit" }),
  buyerPersona: z.string().min(1, { message: "Please describe the buyer persona" }),
  industry: z.string().min(1, { message: "Please select an industry" }),
  personality: z.string().min(1, { message: "Please describe the personality" }),
  rubric: z.string().min(1, { message: "Please provide a rubric or evaluation criteria" }),
  additionalNotes: z.string().optional(),
});

interface AiScenarioFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  setIsFormValid: (isValid: boolean) => void;
}

const AiScenarioForm = ({ onSubmit, setIsFormValid }: AiScenarioFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timeLimit: "10",
      buyerPersona: "",
      industry: "",
      personality: "",
      rubric: "",
      additionalNotes: "",
    },
    mode: "onChange",
  });

  // Update form validity when form state changes
  React.useEffect(() => {
    setIsFormValid(form.formState.isValid);
  }, [form.formState.isValid, setIsFormValid]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight highlight-gradient">
          Step 2: Configure Your Scenario
        </h2>
        <p className="text-muted-foreground mt-2">
          Provide details to customize your AI-generated practice scenario
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Time Parameters Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="overflow-hidden border-t-4 border-dopamine-blue shadow-md hover:shadow-lg transition-all duration-300 card-hover-effect h-full">
                <CardHeader className="bg-gradient-to-r from-dopamine-blue/10 to-cyan-500/5">
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-dopamine-blue" />
                    Time Parameters
                  </CardTitle>
                  <CardDescription>
                    Set the duration for your practice session
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <FormField
                    control={form.control}
                    name="timeLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Limit (minutes)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-dopamine-blue/20 focus:ring-dopamine-blue/30">
                              <SelectValue placeholder="Select time limit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="3">3 minutes</SelectItem>
                            <SelectItem value="5">5 minutes</SelectItem>
                            <SelectItem value="10">10 minutes</SelectItem>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="20">20 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Industry Context Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="overflow-hidden border-t-4 border-dopamine-green shadow-md hover:shadow-lg transition-all duration-300 card-hover-effect h-full">
                <CardHeader className="bg-gradient-to-r from-dopamine-green/10 to-teal-500/5">
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-dopamine-green" />
                    Industry Context
                  </CardTitle>
                  <CardDescription>
                    Select the industry for your scenario
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-dopamine-green/20 focus:ring-dopamine-green/30">
                              <SelectValue placeholder="Select an industry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="hospitality">Hospitality</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Buyer Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card className="overflow-hidden border-t-4 border-dopamine-purple shadow-md hover:shadow-lg transition-all duration-300 card-hover-effect h-full">
                <CardHeader className="bg-gradient-to-r from-dopamine-purple/10 to-indigo-500/5">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-dopamine-purple" />
                    Buyer Details
                  </CardTitle>
                  <CardDescription>
                    Define who you'll be speaking with
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="buyerPersona"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Buyer Position</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. CTO of a mid-size company" 
                            className="border-dopamine-purple/20 focus:ring-dopamine-purple/30"
                            {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="personality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Buyer Persona</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-dopamine-purple/20 focus:ring-dopamine-purple/30">
                              <SelectValue placeholder="Select persona type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="analytical">Analytical</SelectItem>
                            <SelectItem value="expressive">Expressive</SelectItem>
                            <SelectItem value="amiable">Amiable</SelectItem>
                            <SelectItem value="driver">Driver</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Evaluation Criteria Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="md:col-span-1"
            >
              <Card className="overflow-hidden border-t-4 border-dopamine-pink shadow-md hover:shadow-lg transition-all duration-300 card-hover-effect h-full">
                <CardHeader className="bg-gradient-to-r from-dopamine-pink/10 to-rose-500/5">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-dopamine-pink" />
                    Evaluation Criteria
                  </CardTitle>
                  <CardDescription>
                    Define what success looks like
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <FormField
                    control={form.control}
                    name="rubric"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Evaluation Rubric</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="e.g. Clear value proposition, addressed objections, maintained rapport" 
                            className="min-h-[120px] border-dopamine-pink/20 focus:ring-dopamine-pink/30"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Additional Notes Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="md:col-span-1"
            >
              <Card className="overflow-hidden border-t-4 border-dopamine-orange shadow-md hover:shadow-lg transition-all duration-300 card-hover-effect h-full">
                <CardHeader className="bg-gradient-to-r from-dopamine-orange/10 to-amber-500/5">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-dopamine-orange" />
                    Additional Notes
                  </CardTitle>
                  <CardDescription>
                    Any other details you want included in the scenario
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 flex flex-col h-[calc(100%-70px)]">
                  <FormField
                    control={form.control}
                    name="additionalNotes"
                    render={({ field }) => (
                      <FormItem className="flex-grow flex flex-col h-full">
                        <FormControl>
                          <Textarea 
                            placeholder="E.g. specific pain points to address, budget constraints, etc." 
                            className="flex-grow resize-none border-dopamine-orange/20 focus:ring-dopamine-orange/30"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default AiScenarioForm;
