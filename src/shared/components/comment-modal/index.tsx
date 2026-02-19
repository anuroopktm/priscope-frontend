import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Divider,
    useTheme
} from '@mui/material';
import useTranslation from '@/shared/hooks/useTranslation';

type CommentsModalProps = {
    open?: boolean;
    onClose: () => void;
    onSubmit: ((comment: string) => void) | null
};

const CommentsModal = ({ open = true, onClose, onSubmit }: CommentsModalProps) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [comment, setComment] = useState('');
    const [hasError, setHasError] = useState(false);

    const handleSubmit = () => {
        if (!comment.trim()) {
            setHasError(true);
            return;
        }
        onSubmit(comment);
        setComment('');
        setHasError(false);
        onClose();
    };

    const handleCancel = () => {
        setComment('');
        setHasError(false);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '12px',
                    width: '499px'
                }
            }}
        >
            <DialogTitle
                sx={{
                    pb: 1,
                    fontSize: '20px',
                    fontWeight: 600,
                    color: theme.custom.textColor
                }}
            >
                {t('common', 'commentsModal.title')}
            </DialogTitle>
            <Divider />

            <DialogContent sx={{ pb: 1 }}>
                <textarea
                    placeholder={t('common', 'commentsModal.placeholder')}
                    value={comment}
                    onChange={(e) => {
                        setComment(e.target.value);
                        if (hasError) setHasError(false);
                    }}
                    style={{
                        width: '100%',
                        height: '120px',
                        padding: '12px',
                        border: hasError ? '1px solid red' : '1px solid #ddd8d8ff',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                        resize: 'vertical',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => {
                        if (!hasError) e.target.style.borderColor = theme.custom.midnightBlue;
                    }}
                    onBlur={(e) => {
                        if (!hasError) e.target.style.borderColor = '#ddd8d8ff';
                    }}
                />
                {hasError && (
                    <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                        {t('common', 'commentsModal.errorMessage')}
                    </p>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, gap: 1, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                <Button
                    onClick={handleCancel}
                    variant="outlined"
                    sx={{
                        height: '40px',
                        textTransform: 'none',
                        borderColor: theme.custom.midnightBlue,
                        color: theme.custom.midnightBlue,
                        borderRadius: '8px'
                    }}
                >
                    {t('common', 'commentsModal.cancelButton')}
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                        height: '40px',
                        textTransform: 'none',
                        borderRadius: '8px',
                        backgroundColor: theme.custom.midnightBlue,
                        '&:hover': {
                            backgroundColor: theme.custom.midnightBlue
                        }
                    }}
                >
                    {t('common', 'commentsModal.submitButton')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CommentsModal;