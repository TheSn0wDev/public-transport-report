"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { createReport } from "@/actions/reports";
import { toast } from "@/hooks/use-toast";
import { reportSchema } from "@/schemas/report";
import { getReportTypeName } from "@/utils/report-types";
import { ReportType } from "@prisma/client";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Textarea } from "./ui/textarea";

const FloatingButton = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
  });

  async function onSubmit(data: z.infer<typeof reportSchema>) {
    await navigator.geolocation.getCurrentPosition(
      async (position) => {
        const report = await createReport(data.type, data.infos, [
          position.coords.latitude,
          position.coords.longitude,
        ]);

        toast({
          title: "Your report has been sent!",
          description: (
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(report, null, 2)}
            </pre>
          ),
        });

        if ("errors" in report) {
          console.error(report.errors);
          toast({
            title: "An error occurred",
            description: "Please try again later.",
          });
          return;
        }

        form.reset();
        setDialogOpen(false);
      },
      () => console.error("Geolocation is disabled"),
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 20000,
      }
    );
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <div
          role="button"
          className="z-50 bg-primary rounded-full p-3 fixed bottom-4 right-4"
        >
          <Plus className="size-12 text-primary-foreground" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <DialogHeader>
              <DialogTitle>Create your report</DialogTitle>
            </DialogHeader>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the type of your report" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(ReportType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {getReportTypeName(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="infos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Informations</FormLabel>
                  <Textarea placeholder="Additional informations" {...field} />
                  <FormDescription>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Send />
                )}
                Send report
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FloatingButton;
