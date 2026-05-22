'use client';

import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { ImageModalState } from '@/types/gasketCheck';
import {
    IconButton,
    ImageModalBody,
    ImageModalFrame,
    ImageModalImage,
    ModalBackdrop,
    ModalHeader,
    ModalTitle,
} from '@/styles/gasketCheck.styles';

interface ImageModalProps {
    image: ImageModalState | null;
    onClose: () => void;
}

export function ImageModal({
    image,
    onClose,
}: ImageModalProps) {
    if (!image || typeof document === 'undefined') {
        return null;
    }

    return createPortal(
        <ModalBackdrop onClick={onClose}>
            <ImageModalFrame onClick={(event) => event.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>{image.title}</ModalTitle>
                    <IconButton type="button" onClick={onClose} aria-label="이미지 닫기">
                        <X size={18} />
                    </IconButton>
                </ModalHeader>

                <ImageModalBody>
                    <ImageModalImage src={image.imgUrl} alt={image.title} />
                </ImageModalBody>
            </ImageModalFrame>
        </ModalBackdrop>,
        document.body
    );
}
