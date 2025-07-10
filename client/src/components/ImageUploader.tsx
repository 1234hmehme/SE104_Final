import React, { useEffect, useRef, useState } from "react";
import { Button, Stack, Box } from "@mui/material";

export default function ImageUploader({
    onImageSelect,
    initialImage,
}: {
    onImageSelect: (file: File | null) => void;
    initialImage?: string;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(initialImage || null);

    useEffect(() => {
        setPreview(initialImage || null); // khi initialImage thay đổi
    }, [initialImage]);

    const handlePick = () => {
        inputRef.current?.click(); // 👉 Mở file explorer
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file)); // 👉 Hiển thị ảnh tạm
            onImageSelect(file); // Gửi file về parent
        }
    };

    return (
        <Stack spacing={2}>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
            />
            <Button variant="outlined" onClick={handlePick} sx={{
                width: '150px',
                fontSize: "14px",
                fontWeight: "bold",
                borderRadius: '8px',
                color: '#4880FF',
                textTransform: "none",
            }}>
                Chọn ảnh
            </Button>
            <Box
                sx={{
                    width: '100%',
                    height: 300,
                    border: "2px dashed #ccc",
                    backgroundImage: preview ? `url(${preview})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: 2,
                }}
            />
        </Stack>
    );
}
