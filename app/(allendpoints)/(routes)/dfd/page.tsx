"use client";

import * as z from "zod";
import axios from "axios";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ChatCompletionRequestMessage } from "openai";
import Image from "next/image";

import { BotAvatar } from "@/components/bot-avatar";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/loader";
import { LoaderComputer } from "@/components/loader-computer";
import { LoaderMail } from "@/components/loader-mail";
import { LoaderPaint } from "@/components/loader-paint";
import { LoaderTranscript } from "@/components/loader-transcript";
import { UserAvatar } from "@/components/user-avatar";
import { Empty } from "@/components/ui/empty";
import { useProModal } from "@/hooks/use-pro-modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"
import React, { useEffect } from "react";


import { formSchema, amountOptions } from "./constants";

const loaders = [LoaderComputer, LoaderMail, LoaderPaint, LoaderTranscript];

const DfdPage = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

  const [imageData, setImageData] = useState<string | null>(null);
  const [currentLoader, setCurrentLoader] = useState(0); // State to track the current loader
  const [isPolling, setIsPolling] = useState(false); // New state for tracking polling status




  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: ""
    }
  });

  // Extract needed methods from useForm
  const { setValue, watch } = form;

  // Watch for changes in the dropdown selection
  const selectedOption = watch("amount");

  // Use useEffect to update the prompt field when the dropdown changes
  useEffect(() => {
    const selectedAmountOption = amountOptions.find(option => option.value === selectedOption);
    if (selectedAmountOption) {
      setValue("prompt", selectedAmountOption.value); // assuming each option has a description field
    }
  }, [selectedOption, setValue]);


  const isLoading = form.formState.isSubmitting;
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage = values.prompt; // Extract the user's message from the form values      
      const startResponse = await axios.post('/api/dfd', { description: userMessage });
      const taskId = startResponse.data.task_id; // Assuming response contains task_id

    // Update states
    const pollInterval = 2000
    const changeLoader = () => {
      setCurrentLoader((prevLoader) => (prevLoader + 1) % loaders.length);
    };

    setIsPolling(true); // Set polling to true when polling starts


    const pollTaskStatus = async () => {
      try {
        const pollResponse = await axios.post('/api/dfd-poll', { task_id: taskId }, { responseType: 'blob' });
        console.log("POLLING NOW!")
        console.log(pollResponse.data);
        if (pollResponse.status === 202) {
          // Task still processing, continue polling
          setTimeout(pollTaskStatus, pollInterval);
          changeLoader();
        } else if (pollResponse.status === 200) {
          setMessages((current) => [...current, { role: 'user', content: userMessage }]);

          // Task complete, fetch the image
          setIsPolling(false); // Set polling to false when task is complete

          const imageUrl = URL.createObjectURL(pollResponse.data);
          setImageData(imageUrl);
        }
      } catch (pollError) {
        setIsPolling(false); // Set polling to false if an error occurs

        toast.error("Error while polling the task status.");
        console.error(pollError);
      }
    };


      
    pollTaskStatus();
    router.refresh();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
        setIsPolling(false); // Set polling to false if an error occurs

      } else {
        toast.error("Something went wrong.");
        setIsPolling(false); // Set polling to false if an error occurs

      }
    } finally {
      router.refresh();

    }
  }

  return ( 
    <div>
      <Heading
        title="Data Flow Diagram Generator"
        description="Use generative AI to create a data flow diagram for your app architecture."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(onSubmit)} 
              className="
                rounded-lg 
                border 
                w-full 
                p-4 
                px-3 
                md:px-6 
                focus-within:shadow-sm
                grid
                grid-cols-12
                gap-2
              "
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-8">
                    <FormControl className="m-0 p-0">
                      <Textarea
                          className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                          disabled={(isLoading || isPolling)} 
                          placeholder="Describe your app architecture here." 
                          {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select 
                      disabled={(isLoading || isPolling)} 
                      onValueChange={field.onChange} 
                      value={field.value} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {amountOptions.map((option) => (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
              )}
            />
              <Button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={(isLoading || isPolling)} size="icon">
                Get Data Flow Diagram
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {(isLoading || isPolling) && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-slate-100">
              {React.createElement(loaders[currentLoader])}
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label="Provide feedback on this site by using the chat widget in the bottom right corner." />
          )}
          {/* Display only the first user's message */}
          {messages.length > 0 && messages[0].role === "user" && (
            <div className="p-8 w-full flex items-start gap-x-8 rounded-lg bg-white border border-black/10">
              <UserAvatar />
              <p className="text-sm">{messages[0].content}</p>
            </div>
          )}
          {imageData && (
            <div className="flex justify-center my-4">
                <Image
                  src={imageData}
                  alt="Generated Diagram"
                  width={500} // Replace with actual width
                  height={300} // Replace with actual height
                  layout="responsive"
                />
            </div>
          )}

        </div>
      </div>
    </div>
   );
}
 
export default DfdPage;

