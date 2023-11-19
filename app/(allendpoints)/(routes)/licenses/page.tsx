"use client";

// Library imports
import { marked } from "marked";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import * as z from "zod";

// Component imports
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/heading";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { UserAvatar } from "@/components/user-avatar";
import { Loader } from "@/components/loader";
import { Input } from "@/components/ui/input";
import { BotAvatar } from "@/components/bot-avatar";
import { Empty } from "@/components/ui/empty";

// Utility & hooks imports
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProModal } from "@/hooks/use-pro-modal";

// Constants
import { ChatCompletionRequestMessage } from "openai";
import { formSchema } from "./constants";

const LicensePage = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const userMessage = { role: "user", content: values.prompt };
    const systemMessage = {
      role: "system",
      content: "You are an open source compliance expert. Answer each of the following questions. Put a markdown header for each question. If a github URL is included in the message, briefly describe what the repo is used for. What are the compliance requirements for this license? Can I use this for commercial purposes? Are there restrictions on using this program?"
    };

    try {
      const newMessages = [...messages, systemMessage, userMessage];
      const response = await axios.post('/api/licenses', { messages: newMessages });
      setMessages((current) => [...current, userMessage, response.data]);

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
        title="Understand Licenses"
        description="Understand the compliance requirements of a Github project or license text."
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
                border
                w-full
                grid
                p-4
                grid-cols-12
                shadow-md
                rounded-md
                focus-within:shadow-sm
                gap-2
                px-3
                md:px-6
              "
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading} 
                        placeholder="Paste Github URL or license text here. Ex. https://github.com/octokit/rest.js (or directly paste your license text)" 
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={isLoading} size="icon">
                Understand License
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
          {messages.length === 0 && !isLoading && (
            <Empty label="Provide feedback on this site by using the chat widget in the bottom right corner." />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message) => (
              <div 
                key={message.content} 
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user" ? "bg-white border border-black/10" : "bg-slate-100",
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <div 
                  className="text-sm" 
                  dangerouslySetInnerHTML={{ __html: marked(message.content ?? "") }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LicensePage;