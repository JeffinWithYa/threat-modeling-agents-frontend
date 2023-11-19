import * as z from "zod";

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Prompt is required."
  }),
  amount: z.string().min(1)
});

export const amountOptions = [
  {
    value: "You are a GRC and open source compliance expert with a bias to believe in the power of open source and freely sharing their creations under permissive licenses.",
    label: "Zag: Open sources code."
  },
  {
    value: "You are a GRC and open source compliance expert with a bias to prefer keeping their creations proprietary, or at least requiring copy-left licenses.",
    label: "Nyx: Keeps strict rights."
  }
];
