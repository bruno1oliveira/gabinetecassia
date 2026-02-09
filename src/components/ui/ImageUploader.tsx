'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ImageUploaderProps {
    value?: string;
    onChange: (url: string) => void;
    bucket?: string;
    folder?: string;
    className?: string;
    aspectRatio?: 'square' | 'video' | 'auto';
}

export default function ImageUploader({
    value,
    onChange,
    bucket = 'site-images',
    folder = '',
    className = '',
    aspectRatio = 'auto',
}: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const aspectClasses = {
        square: 'aspect-square',
        video: 'aspect-video',
        auto: 'min-h-[200px]',
    };

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragIn = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragOut = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const uploadFile = async (file: File) => {
        setIsUploading(true);
        setError(null);

        try {
            // Validar tipo de arquivo
            if (!file.type.startsWith('image/')) {
                throw new Error('Por favor, selecione uma imagem válida.');
            }

            // Validar tamanho (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                throw new Error('A imagem deve ter no máximo 5MB.');
            }

            const supabase = createClient();

            // Gerar nome único
            const ext = file.name.split('.').pop();
            const fileName = `${folder ? folder + '/' : ''}${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

            // Upload
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (uploadError) {
                throw new Error(uploadError.message);
            }

            // Obter URL pública
            const { data: publicUrl } = supabase.storage
                .from(bucket)
                .getPublicUrl(fileName);

            onChange(publicUrl.publicUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao fazer upload');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            uploadFile(files[0]);
        }
    }, [folder, bucket, onChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            uploadFile(files[0]);
        }
    };

    const handleRemove = () => {
        onChange('');
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    return (
        <div className={className}>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
            />

            {value ? (
                <div className={`relative rounded-lg overflow-hidden border-2 border-gray-200 ${aspectClasses[aspectRatio]}`}>
                    <img
                        src={value}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <motion.div
                    onClick={handleClick}
                    onDragEnter={handleDragIn}
                    onDragLeave={handleDragOut}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`
                        relative cursor-pointer rounded-lg border-2 border-dashed transition-all
                        ${aspectClasses[aspectRatio]}
                        ${isDragging
                            ? 'border-[#E30613] bg-[#E30613]/5'
                            : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
                        }
                        ${isUploading ? 'pointer-events-none' : ''}
                    `}
                >
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                        {isUploading ? (
                            <>
                                <Loader2 className="w-10 h-10 text-[#E30613] animate-spin mb-3" />
                                <p className="text-sm text-gray-600">Enviando...</p>
                            </>
                        ) : (
                            <>
                                <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                                    {isDragging ? (
                                        <Upload className="w-6 h-6 text-[#E30613]" />
                                    ) : (
                                        <ImageIcon className="w-6 h-6 text-gray-500" />
                                    )}
                                </div>
                                <p className="text-sm font-medium text-gray-700 mb-1">
                                    {isDragging ? 'Solte a imagem aqui' : 'Clique ou arraste uma imagem'}
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG até 5MB</p>
                            </>
                        )}
                    </div>
                </motion.div>
            )}

            {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
