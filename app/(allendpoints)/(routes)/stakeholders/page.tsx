"use client";

import * as z from "zod";
import axios from "axios";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ChatCompletionRequestMessage } from "openai";

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
import { EmptyStakeholders } from "@/components/ui/emptystakeholders";
import { useProModal } from "@/hooks/use-pro-modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea"

import { formSchema, amountOptions } from "./constants";
const loaders = [LoaderComputer, LoaderMail, LoaderPaint, LoaderTranscript];


const StakeholdersPage = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  
  // ADDED FOR PDF GENERATION
  const [pdfUrl, setPdfUrl] = useState<string|undefined>(undefined); // State to store the PDF URL
  const [currentLoader, setCurrentLoader] = useState(0); // State to track the current loader
  const [isPolling, setIsPolling] = useState(false); // New state for tracking polling status
  const [selectedDropdownValue, setSelectedDropdownValue] = useState("");
  const [pollCounter, setPollCounter] = useState(0);




  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: amountOptions[0].value,
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
      setSelectedDropdownValue(selectedAmountOption.value);
    }
  }, [selectedOption]);

  // Use useEffect to conditionally update the prompt field when the dropdown changes
  useEffect(() => {
    if (selectedDropdownValue) {
      setValue("prompt", selectedDropdownValue);
    }
  }, [selectedDropdownValue, setValue, form]);

  const isLoading = form.formState.isSubmitting;
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setMessages([]);

      const userMessage = values.prompt; // Extract the user's message from the form values

      // Send the user's message to your API
      const startResponse = await axios.post('/api/stakeholders', { description: userMessage });
      const taskId = startResponse.data.task_id; // Assuming response contains task_id
      setMessages((current) => [...current, { role: 'user', content: userMessage }]);

      const pollInterval = 2000
      const changeLoader = () => {
        setCurrentLoader((prevLoader) => (prevLoader + 1) % loaders.length);
      };

      setIsPolling(true); // Set polling to true when polling starts

      const pollTaskStatus = async () => {
        try {
          const pollResponse = await axios.post('/api/stakeholders-poll', { task_id: taskId });
          console.log("POLLING NOW!")
          //console.log(pollResponse.data);
          if (pollResponse.status === 202) {
            // Task still processing, continue polling
            const taskMessage = pollResponse.data.detail || "Task is still processing...";
            console.log(taskMessage)
            

            setTimeout(pollTaskStatus, pollInterval);
            changeLoader();
            try {
              const lastMessageResponse = await axios.post('/api/lastmessage/', { task_id: taskId, endpoint: "stakeholders" });
              if (lastMessageResponse.status === 200) {
                const newLastMessage = lastMessageResponse.data.last_message;
                // Handle the last message as needed
                console.log("Last message from conversation log:", newLastMessage);
                // Optionally, you can add this message to your UI as well
                //setMessages(currentMessages => [...currentMessages, { role: 'system', content: lastMessage }]);
                setMessages(currentMessages => {
                  if (currentMessages.length > 0 && currentMessages[currentMessages.length - 1].content) {
                    const lastCurrentMessage = currentMessages[currentMessages.length - 1].content;
            
                    // Check if the new message is the same as the last one
                    if (newLastMessage === lastCurrentMessage) {
                      setPollCounter(prevCounter => prevCounter + 1);
  
                      if (pollCounter >= 19) {
                        setIsPolling(false);
                        toast.error("Polling limit reached without new updates.");
                        return currentMessages;
                      }
                      return currentMessages; // Return the current state without change
  
            
                    } else {
                      setPollCounter(0);
                    }
            
                    // Find the overlap and trim it
                    let trimmedMessage = newLastMessage;
                    for (let i = 0; i < lastCurrentMessage!.length; i++) {
                      if (newLastMessage.startsWith(lastCurrentMessage!.slice(i))) {
                        trimmedMessage = newLastMessage.slice(lastCurrentMessage!.length - i);
                        break;
                      }
          }
  
          // Add the trimmed message if it's not empty
          if (trimmedMessage.trim().length > 0) {
            return [...currentMessages, { role: 'system', content: trimmedMessage.trim() }];
          } else {
            return currentMessages;
          }
                  }
            
                  // If there are no messages yet or no duplication/overlap, add the new message
                  return [...currentMessages, { role: 'system', content: newLastMessage }];
                });
  
              }
            } catch (err) {
              console.error("Error fetching last message:", err);
            }
          } else if (pollResponse.status === 200) {
            console.log("POLLING COMPLETE!")
            const pollResponse = await axios.post('/api/stakeholders-poll', { task_id: taskId }, { responseType: 'blob' });
            setMessages((current) => [...current, { role: 'user', content: userMessage }]);
  
            // Task complete, fetch the image
            setIsPolling(false); // Set polling to false when task is complete
  
            const pdfBlob = new Blob([pollResponse.data], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(pdfBlob);
            console.log(pdfUrl);
            setPdfUrl(pdfUrl); // Update the state with the Blob URL

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
        title="Represent various Roles in the threat modeling exercide."
        description="Generate a threat modeling report that includes input from various AI stakeholders including a compliance officer, a security engineer, an architect, and a business staholder."
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
                        disabled={isLoading || isPolling} 
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
                      disabled={isLoading || isPolling} 
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
              <Button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={isLoading || isPolling} size="icon">
                Get Report
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {(isLoading || isPolling ) && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-slate-100">
              {React.createElement(loaders[currentLoader])}
            </div>
          )}
          {/* Display an empty state if no messages and not loading */}
          {messages.length === 0 && !isLoading && (
            <EmptyStakeholders label="Provide feedback on this site by using the chat widget in the bottom right corner." />
          )}
          {messages.map((message, index) => (
            <div 
              key={index}
              className={`p-8 w-full flex items-start gap-x-8 rounded-lg ${message.role === "user" ? "bg-white border border-black/10" : "bg-muted"}`}
            >
              {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
              <p className="text-sm">{message.content}</p>
            </div>
          ))}

          {/* PDF Viewer */}
          {pdfUrl && (
            <div className="my-4">
              <iframe 
                src={pdfUrl} 
                width="100%" 
                height="600px" 
                style={{ border: "none" }}
                title="PDF Viewer"
              ></iframe>
              {/* Download PDF Button */}

          </div>
            
          )}



        </div>
      </div>
    </div>
  );

}
 
export default StakeholdersPage;

