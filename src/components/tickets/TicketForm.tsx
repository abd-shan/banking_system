import React, { useState } from 'react';
import { useTicket } from '@/context/TicketContext';
import { X, AlertCircle, Send } from 'lucide-react';

interface TicketFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

const TicketForm: React.FC<TicketFormProps> = ({ onSuccess, onCancel }) => {
    const { createNewTicket, isLoading, errors } = useTicket();

    const [formData, setFormData] = useState({
        subject: '',
        message: '',
    });

    const [validationErrors, setValidationErrors] = useState<{
        subject?: string;
        message?: string;
    }>({});

    const validateForm = (): boolean => {
        const errors: { subject?: string; message?: string } = {};

        if (!formData.subject.trim()) {
            errors.subject = 'Subject is required';
        } else if (formData.subject.length > 100) {
            errors.subject = 'Subject cannot exceed 100 characters';
        }

        if (!formData.message.trim()) {
            errors.message = 'Message is required';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await createNewTicket({
                subject: formData.subject.trim(),
                message: formData.message.trim(),
            });

            // Reset form
            setFormData({
                subject: '',
                message: '',
            });
            setValidationErrors({});

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {

            console.error('Failed to submit ticket:', error);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));


        if (validationErrors[name as keyof typeof validationErrors]) {
            setValidationErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const getCharacterCountColor = (count: number, max: number) => {
        const percentage = (count / max) * 100;
        if (percentage >= 90) return 'text-red-600';
        if (percentage >= 75) return 'text-yellow-600';
        return 'text-slate-500';
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Send className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                            Create New Support Ticket
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            We'll respond to your issue as soon as possible
                        </p>
                    </div>
                </div>

                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                )}
            </div>

            {errors.create && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-red-800 dark:text-red-300">
                                Failed to create ticket
                            </p>
                            <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                                {errors.create.message}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Subject *
                        </label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Briefly describe your issue"
                            className={`w-full px-4 py-3 border rounded-lg text-slate-800 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                validationErrors.subject
                                    ? 'border-red-300 dark:border-red-700'
                                    : 'border-slate-300 dark:border-slate-600'
                            }`}
                            disabled={isLoading.creating}
                            maxLength={100}
                        />
                        <div className="flex justify-between mt-2">
                            {validationErrors.subject && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {validationErrors.subject}
                                </p>
                            )}
                            <p className={`text-sm ml-auto ${getCharacterCountColor(formData.subject.length, 100)}`}>
                                {formData.subject.length}/100
                            </p>
                        </div>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Message *
                        </label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Please provide detailed information about your issue..."
                            rows={6}
                            className={`w-full px-4 py-3 border rounded-lg text-slate-800 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                                validationErrors.message
                                    ? 'border-red-300 dark:border-red-700'
                                    : 'border-slate-300 dark:border-slate-600'
                            }`}
                            disabled={isLoading.creating}
                            maxLength={2000}
                        />
                        <div className="flex justify-between mt-2">
                            {validationErrors.message && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {validationErrors.message}
                                </p>
                            )}
                            <p className={`text-sm ml-auto ${getCharacterCountColor(formData.message.length, 2000)}`}>
                                {formData.message.length}/2000
                            </p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                disabled={isLoading.creating}
                                className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading.creating}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading.creating ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Create Ticket
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default TicketForm;