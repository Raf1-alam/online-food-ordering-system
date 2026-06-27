import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5 text-primary-400" />,
      label: 'Email Us',
      value: 'support@foody.com',
      subtext: 'We reply within 24 hours'
    },
    {
      icon: <Phone className="h-5 w-5 text-primary-400" />,
      label: 'Call Us',
      value: '+1 (555) 345-6789',
      subtext: 'Mon-Fri from 9am to 6pm'
    },
    {
      icon: <MapPin className="h-5 w-5 text-primary-400" />,
      label: 'Visit Us',
      value: '100 Culinary Blvd, Suite 400',
      subtext: 'San Francisco, CA 94103'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-6xl mx-auto space-y-12 py-8"
    >
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold tracking-widest text-primary-500 uppercase bg-primary-500/10 px-3 py-1.5 rounded-full border border-primary-500/20">
          Get in touch
        </span>
        <h1 className="text-4xl font-extrabold text-white">We'd Love to Hear From You</h1>
        <p className="text-slate-400">Have questions about our service, partnerships, or just want to say hello? Drop us a line below.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info Cards Column */}
        <div className="space-y-6 lg:col-span-1">
          {contactInfo.map((info) => (
            <div key={info.label} className="glass-panel p-6 flex gap-4 items-start border border-dark-border">
              <div className="p-3 bg-dark/60 rounded-xl border border-dark-border shrink-0">
                {info.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{info.label}</h3>
                <p className="text-white font-bold text-base">{info.value}</p>
                <p className="text-xs text-slate-500">{info.subtext}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Form Column */}
        <div className="lg:col-span-2">
          <div className="glass-panel p-8 border border-dark-border relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form 
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
                      <input 
                        required
                        type="text" 
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-dark border border-dark-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                      <input 
                        required
                        type="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-dark border border-dark-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                    <input 
                      required
                      type="text" 
                      name="subject" 
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-dark border border-dark-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                    <textarea 
                      required
                      rows={5}
                      name="message" 
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-dark border border-dark-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors resize-none"
                      placeholder="Write your message here..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full py-3 flex items-center justify-center gap-2 font-semibold text-lg"
                  >
                    {submitting ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        Send Message <Send className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success-screen"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-4"
                >
                  <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto" />
                  <h2 className="text-2xl font-bold text-white">Thank You!</h2>
                  <p className="text-slate-400 max-w-md mx-auto">Your message has been sent successfully. Our support team will get in touch with you shortly.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="btn-outline px-6 py-2.5 text-sm"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
