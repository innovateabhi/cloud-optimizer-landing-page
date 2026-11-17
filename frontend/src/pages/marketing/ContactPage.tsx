import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { 
  Mail, 
  MessageSquare, 
  Building2, 
  Clock, 
  CheckCircle2, 
  Send,
  Loader2 
} from 'lucide-react';
import { leadService } from '../../services/leadService';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email address required'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await leadService.submitContactInquiry(data);
      if (res.success) {
        setSubmitted(true);
        reset();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-blue text-primary-blue text-xs font-semibold border border-primary-blue/20">
              <Mail className="w-3.5 h-3.5" />
              <span>Get In Touch</span>
            </div>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-text-primary tracking-tight">
              Contact Cloud Optimizer
            </h1>
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
              Have questions about platform integration, custom enterprise deployments, or FinOps best practices? Our engineering and sales team is here to assist.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto items-start">
            
            {/* Left: Contact Info */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="p-6 rounded-3xl bg-white border border-border shadow-subtle space-y-4">
                <div className="w-10 h-10 rounded-xl bg-surface-blue flex items-center justify-center text-primary-blue">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-text-primary">Direct Email</h3>
                  <p className="text-xs text-text-secondary mt-1">support@cloudoptimizer.io</p>
                  <p className="text-xs text-text-secondary">sales@cloudoptimizer.io</p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-border shadow-subtle space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-success-green flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-text-primary">Support Response SLA</h3>
                  <p className="text-xs text-text-secondary mt-1">
                    Free / Starter: Under 24 hours (business days)
                  </p>
                  <p className="text-xs text-text-secondary">
                    Business / Enterprise: 2-hour priority response window
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-border shadow-subtle space-y-4">
                <div className="w-10 h-10 rounded-xl bg-surface-blue flex items-center justify-center text-primary-blue">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-text-primary">Enterprise Headquarters</h3>
                  <p className="text-xs text-text-secondary mt-1">
                    Cloud Optimizer Inc.<br />
                    Cyber City FinTech Tower, Level 8<br />
                    Bengaluru / Global Distributed Support
                  </p>
                </div>
              </div>

            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-border shadow-premium p-6 sm:p-10">
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-success-green flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-text-primary">Message Sent Successfully!</h3>
                  <p className="text-xs sm:text-sm text-text-secondary max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out. A representative from our team will respond to your email shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-5 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-surface-blue transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <h3 className="font-display font-bold text-lg text-text-primary pb-2 border-b border-border">
                    Send an Inquiry
                  </h3>

                  <div>
                    <label className="text-xs font-semibold text-text-primary block mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Alex Rivera"
                      {...register('name')}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-primary-blue ${
                        errors.name ? 'border-danger' : 'border-border'
                      }`}
                    />
                    {errors.name && <p className="text-[11px] text-danger mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-text-primary block mb-1">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      placeholder="alex@acme.com"
                      {...register('email')}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-primary-blue ${
                        errors.email ? 'border-danger' : 'border-border'
                      }`}
                    />
                    {errors.email && <p className="text-[11px] text-danger mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-text-primary block mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      placeholder="Inquiry regarding multi-account enterprise tier..."
                      {...register('subject')}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-primary-blue ${
                        errors.subject ? 'border-danger' : 'border-border'
                      }`}
                    />
                    {errors.subject && <p className="text-[11px] text-danger mt-1">{errors.subject.message}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-text-primary block mb-1">
                      Message *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Please let us know how we can help..."
                      {...register('message')}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-primary-blue ${
                        errors.message ? 'border-danger' : 'border-border'
                      }`}
                    />
                    {errors.message && <p className="text-[11px] text-danger mt-1">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-primary-blue hover:bg-primary-blue-hover text-white text-xs sm:text-sm font-semibold shadow-premium transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};
