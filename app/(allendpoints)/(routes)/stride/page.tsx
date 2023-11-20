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
import { UserAvatar } from "@/components/user-avatar";
import { Empty } from "@/components/ui/empty";
import { useProModal } from "@/hooks/use-pro-modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea"



import { formSchema, amountOptions } from "./constants";

const PersonaPage = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  
  // ADDED FOR PDF GENERATION
  const [pdfUrl, setPdfUrl] = useState<string|undefined>(undefined); // State to store the PDF URL


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: "Open source friendly."
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

      // Send the user's message to your API
      const response = await axios.post('/api/persona', { description: userMessage }, { responseType: 'blob' });

      // Create a Blob URL from the response data
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      console.log(pdfUrl);
  
      // Update the messages state with the user's message and the API response
      setMessages((current) => [...current, { role: "user", content: userMessage }, { role: "system", content: response.data }]);
  
      setPdfUrl(pdfUrl); // Update the state with the Blob URL
      
      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      router.refresh();
    }
  }

  return ( 
    <div>
      <Heading
        title="Apply the STRIDE Methodology to every component of your system."
        description="Generate a report that describes the threats to your system and how to mitigate them."
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
                        disabled={isLoading} 
                        placeholder="Describe your app architecture here." 
                        {...field}
                        minRows={3} // Set the minimum number of rows
                        autoResize // Enable auto-resizing
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
                      disabled={isLoading} 
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
              <Button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={isLoading} size="icon">
                Get Advice
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-slate-100">
              <Loader />
            </div>
          )}
          {/* Display an empty state if no messages and not loading */}
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
            <a
              href={pdfUrl}
              download="tm_report.pdf" 
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Download PDF
            </a>
          </div>
            
          )}



        </div>
      </div>
    </div>
  );

}
 
export default PersonaPage;

