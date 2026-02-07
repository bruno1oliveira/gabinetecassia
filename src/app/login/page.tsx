'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const supabase = createClient();

            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                if (authError.message.includes('Invalid login credentials')) {
                    setError('E-mail ou senha incorretos.');
                } else {
                    setError(authError.message);
                }
                setIsLoading(false);
                return;
            }

            if (data.user) {
                // Login bem-sucedido, redirecionar para admin
                router.push('/admin');
                router.refresh();
            }
        } catch (err) {
            setError('Erro ao conectar. Tente novamente.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#E30613]/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FBBF24]/20 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#E30613] to-[#B91C1C] rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                            <span className="text-white text-3xl font-bold">C</span>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Painel Administrativo
                    </h1>
                    <p className="text-gray-400">
                        Gabinete da Vereadora Cássia
                    </p>
                </div>

                {/* Login Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
                >
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-200"
                            >
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm">{error}</p>
                            </motion.div>
                        )}

                        {/* Email Input */}
                        <div>
                            <label className="flex items-center gap-2 text-gray-300 text-sm font-medium mb-2">
                                <Mail className="w-4 h-4" />
                                E-mail
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 transition-all outline-none"
                                placeholder="seu@email.com"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="flex items-center gap-2 text-gray-300 text-sm font-medium mb-2">
                                <Lock className="w-4 h-4" />
                                Senha
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3.5 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 transition-all outline-none"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[#E30613] to-[#B91C1C] text-white shadow-lg shadow-red-500/30 hover:shadow-xl hover:scale-[1.01]"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Entrando...
                                </>
                            ) : (
                                <>
                                    Entrar <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Forgot Password */}
                    <div className="mt-6 text-center">
                        <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                            Esqueceu a senha?
                        </a>
                    </div>
                </motion.div>

                {/* Footer */}
                <p className="text-center text-gray-500 text-sm mt-8">
                    © 2025 Gabinete Vereadora Cássia • PT Caraguatatuba
                </p>
            </motion.div>
        </div>
    );
}
