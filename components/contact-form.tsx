'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';

type FormValues = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    }
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    
    try {
      // Simulate sending email (in production, replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create email content in markdown format
      const emailContent = `
# New Contact Form Submission

**From:** ${data.name}
**Email:** ${data.email}
${data.phone ? `**Phone:** ${data.phone}` : ''}
**Subject:** ${data.subject}

## Message:
${data.message}

---
*Submitted via your portfolio website contact form*
      `;
      
      console.log('Email content generated:', emailContent);
      
      // Reset form and show success dialog
      reset();
      setSuccess(true);
      setShowDialog(true);
    } catch (error) {
      // Show error dialog
      setSuccess(false);
      setErrorMessage('There was an error sending your message. Please try again or contact me directly.');
      setShowDialog(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-700 dark:text-slate-200">Name <span className="text-red-500">*</span></Label>
          <Input 
            id="name"
            className="bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-700" 
            placeholder="Your Name"
            {...register('name', { 
              required: 'Name is required' 
            })}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700 dark:text-slate-200">Email <span className="text-red-500">*</span></Label>
          <Input 
            id="email"
            type="email"
            className="bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-700" 
            placeholder="your.email@example.com"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-slate-700 dark:text-slate-200">Phone (Optional)</Label>
          <Input 
            id="phone"
            className="bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-700" 
            placeholder="(123) 456-7890"
            {...register('phone')}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="subject" className="text-slate-700 dark:text-slate-200">Subject <span className="text-red-500">*</span></Label>
          <Input 
            id="subject"
            className="bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-700" 
            placeholder="What is your message regarding?"
            {...register('subject', { required: 'Subject is required' })}
          />
          {errors.subject && (
            <p className="text-sm text-red-500">{errors.subject.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="message" className="text-slate-700 dark:text-slate-200">Message <span className="text-red-500">*</span></Label>
          <Textarea 
            id="message"
            className="min-h-[150px] bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-700" 
            placeholder="Your message here..."
            {...register('message', { 
              required: 'Message is required',
              minLength: {
                value: 10,
                message: 'Message should be at least 10 characters'
              }
            })}
          />
          {errors.message && (
            <p className="text-sm text-red-500">{errors.message.message}</p>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>

      {/* Success/Error Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {success ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Message Sent!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span>Error</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {success ? (
                "Thank you for reaching out! I'll review your message and get back to you shortly."
              ) : (
                errorMessage
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowDialog(false)} className="bg-blue-600 hover:bg-blue-700 text-white">
              {success ? 'Done' : 'Try Again'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
