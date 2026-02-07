'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle, Send, User, Phone, MapPin,
    Lightbulb, Wrench, Heart, Stethoscope, GraduationCap, Bus, Home, HelpCircle,
    CheckCircle, ArrowRight, ArrowLeft, Sparkles, AlertCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const demandTypes = [
    { value: 'iluminacao', label: 'Iluminação Pública', icon: Lightbulb, emoji: '💡' },
    { value: 'buraco', label: 'Buraco/Pavimentação', icon: Wrench, emoji: '🕳️' },
    { value: 'assistencia', label: 'Assistência Social', icon: Heart, emoji: '🤝' },
    { value: 'saude', label: 'Saúde', icon: Stethoscope, emoji: '🏥' },
    { value: 'educacao', label: 'Educação', icon: GraduationCap, emoji: '📚' },
    { value: 'transporte', label: 'Transporte', icon: Bus, emoji: '🚌' },
    { value: 'moradia', label: 'Moradia', icon: Home, emoji: '🏠' },
    { value: 'outros', label: 'Outros', icon: HelpCircle, emoji: '📋' },
];

interface Neighborhood {
    id: number;
    name: string;
}

export default function GabineteDigital() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
    const [formData, setFormData] = useState({
        name: '', phone: '', neighborhood: '', demandType: '', description: '',
    });

    const supabase = createClient();

    // Carregar bairros do banco de dados
    useEffect(() => {
        const loadNeighborhoods = async () => {
            const { data } = await supabase.from('neighborhoods').select('id, name').order('name');
            if (data) setNeighborhoods(data);
        };
        loadNeighborhoods();
    }, []);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            // Encontrar o ID do bairro selecionado
            const selectedNeighborhood = neighborhoods.find(n => n.name === formData.neighborhood);

            // Preparar dados para inserção
            const demandData = {
                citizen_name: formData.name,
                citizen_phone: formData.phone,
                neighborhood_id: selectedNeighborhood?.id || null,
                type: formData.demandType,
                description: formData.description,
                status: 'nova',
                priority: 3, // Prioridade normal
            };

            // Inserir no Supabase
            const { error: insertError } = await supabase.from('demands').insert(demandData);

            if (insertError) {
                console.error('Erro ao salvar demanda:', insertError);
                setError('Ocorreu um erro ao enviar sua demanda. Tente novamente.');
                setIsSubmitting(false);
                return;
            }

            setIsSubmitting(false);
            setIsSuccess(true);
        } catch (err) {
            console.error('Erro:', err);
            setError('Ocorreu um erro inesperado. Tente novamente.');
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setIsSuccess(false);
        setError(null);
        setStep(1);
        setFormData({ name: '', phone: '', neighborhood: '', demandType: '', description: '' });
    };

    return (
        <section id="gabinete" className="py-20 bg-gradient-to-b from-white via-[#FEF7F7] to-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#E30613]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FBBF24]/5 rounded-full blur-3xl" />

            <div className="container-main relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="badge-pt mb-4 mx-auto">
                        <Sparkles className="w-4 h-4" />
                        Atendimento Direto
                    </div>
                    <h2 className="section-title mb-4">
                        Conta pra gente,{' '}
                        <span className="gradient-text">como podemos ajudar?</span>
                    </h2>
                    <p className="section-subtitle">
                        Sua demanda é importante! Estamos aqui para ouvir e lutar por você.
                    </p>
                </motion.div>

                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass-card rounded-3xl overflow-hidden"
                    >
                        <AnimatePresence mode="wait">
                            {isSuccess ? (
                                /* Success State */
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="p-12 text-center"
                                >
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-10 h-10 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        Recebemos sua mensagem! 🎉
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Nossa equipe vai analisar e entrar em contato em breve.
                                        <br />Obrigada por confiar no nosso gabinete!
                                    </p>
                                    <button onClick={resetForm} className="btn-pt px-8 py-3 rounded-xl">
                                        Enviar outra demanda
                                    </button>
                                </motion.div>
                            ) : (
                                <div className="p-8 md:p-10">
                                    {/* Progress indicator */}
                                    <div className="flex items-center justify-center gap-2 mb-8">
                                        {[1, 2, 3].map((s) => (
                                            <div key={s} className="flex items-center">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s
                                                    ? 'bg-[#E30613] text-white shadow-lg shadow-red-500/30'
                                                    : 'bg-gray-200 text-gray-500'
                                                    }`}>
                                                    {step > s ? '✓' : s}
                                                </div>
                                                {s < 3 && (
                                                    <div className={`w-12 h-1 mx-1 rounded ${step > s ? 'bg-[#E30613]' : 'bg-gray-200'}`} />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {/* Step 1: Choose demand type */}
                                        {step === 1 && (
                                            <motion.div
                                                key="step1"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                            >
                                                <h3 className="text-xl font-bold text-gray-900 text-center mb-6">
                                                    Qual o tipo da sua demanda? 🤔
                                                </h3>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                                                    {demandTypes.map((type) => (
                                                        <button
                                                            key={type.value}
                                                            onClick={() => setFormData({ ...formData, demandType: type.value })}
                                                            className={`p-4 rounded-2xl border-2 transition-all text-center hover:scale-[1.02] ${formData.demandType === type.value
                                                                ? 'border-[#E30613] bg-[#E30613]/5 shadow-lg'
                                                                : 'border-gray-200 hover:border-[#E30613]/50 bg-white'
                                                                }`}
                                                        >
                                                            <span className="text-3xl block mb-2">{type.emoji}</span>
                                                            <span className="text-sm font-medium text-gray-700">{type.label}</span>
                                                        </button>
                                                    ))}
                                                </div>

                                                <button
                                                    onClick={() => formData.demandType && setStep(2)}
                                                    disabled={!formData.demandType}
                                                    className="w-full btn-pt py-4 rounded-2xl flex items-center justify-center gap-2 text-lg disabled:opacity-50"
                                                >
                                                    Continuar <ArrowRight className="w-5 h-5" />
                                                </button>
                                            </motion.div>
                                        )}

                                        {/* Step 2: Personal info */}
                                        {step === 2 && (
                                            <motion.div
                                                key="step2"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-5"
                                            >
                                                <h3 className="text-xl font-bold text-gray-900 text-center mb-6">
                                                    Agora, me conta um pouco sobre você 👋
                                                </h3>

                                                <div>
                                                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                                                        <User className="w-4 h-4 text-[#E30613]" />
                                                        Como posso te chamar?
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="input-field"
                                                        placeholder="Seu nome"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                                                        <Phone className="w-4 h-4 text-[#E30613]" />
                                                        Qual seu WhatsApp?
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        className="input-field"
                                                        placeholder="(12) 99999-9999"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                                                        <MapPin className="w-4 h-4 text-[#E30613]" />
                                                        Em qual bairro você mora?
                                                    </label>
                                                    <select
                                                        value={formData.neighborhood}
                                                        onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                                                        className="input-field bg-white"
                                                    >
                                                        <option value="">Selecione seu bairro</option>
                                                        {neighborhoods.map(n => <option key={n.id} value={n.name}>{n.name}</option>)}
                                                    </select>
                                                </div>

                                                <div className="flex gap-3 pt-4">
                                                    <button
                                                        onClick={() => setStep(1)}
                                                        className="flex-1 py-4 rounded-2xl border-2 border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                                                    >
                                                        <ArrowLeft className="w-5 h-5" /> Voltar
                                                    </button>
                                                    <button
                                                        onClick={() => formData.name && formData.phone && formData.neighborhood && setStep(3)}
                                                        disabled={!formData.name || !formData.phone || !formData.neighborhood}
                                                        className="flex-1 btn-pt py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50"
                                                    >
                                                        Continuar <ArrowRight className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Step 3: Describe problem */}
                                        {step === 3 && (
                                            <motion.div
                                                key="step3"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-5"
                                            >
                                                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                                                    Conta pra gente o que está acontecendo 📝
                                                </h3>
                                                <p className="text-gray-500 text-center text-sm mb-6">
                                                    Quanto mais detalhes, melhor podemos ajudar!
                                                </p>

                                                <textarea
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    rows={5}
                                                    className="input-field resize-none"
                                                    placeholder="Descreva sua demanda aqui... Pode incluir endereço, há quanto tempo o problema existe, quantas pessoas são afetadas, etc."
                                                />

                                                {/* Summary card */}
                                                <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-sm">
                                                    <div className="font-semibold text-gray-900 mb-3">📋 Resumo da sua demanda:</div>
                                                    <div><strong>Tipo:</strong> {demandTypes.find(t => t.value === formData.demandType)?.emoji} {demandTypes.find(t => t.value === formData.demandType)?.label}</div>
                                                    <div><strong>Nome:</strong> {formData.name}</div>
                                                    <div><strong>WhatsApp:</strong> {formData.phone}</div>
                                                    <div><strong>Bairro:</strong> {formData.neighborhood}</div>
                                                </div>

                                                <div className="flex gap-3 pt-4">
                                                    <button
                                                        onClick={() => setStep(2)}
                                                        className="flex-1 py-4 rounded-2xl border-2 border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                                                    >
                                                        <ArrowLeft className="w-5 h-5" /> Voltar
                                                    </button>
                                                    <button
                                                        onClick={handleSubmit}
                                                        disabled={!formData.description || isSubmitting}
                                                        className="flex-1 btn-pt py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50"
                                                    >
                                                        {isSubmitting ? (
                                                            <>Enviando...</>
                                                        ) : (
                                                            <>
                                                                <Send className="w-5 h-5" /> Enviar Demanda
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Alternative contact */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mt-8 text-center"
                    >
                        <p className="text-gray-500 mb-4">Prefere falar diretamente?</p>
                        <a
                            href="https://wa.me/5512999999999"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 btn-whatsapp px-6 py-3 rounded-2xl"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Chamar no WhatsApp
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
