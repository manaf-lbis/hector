export const validateDob = (value: string): string | null => {
    if (!value) return "Date of Birth is required";
    
    const dob = new Date(value);
    const today = new Date();
    
    if (dob > today) return "Date of Birth cannot be in the future";
    
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    
    if (age < 18) return "You must be at least 18 years old";
    
    return null;
};

export const validateDocumentNumber = (type: string, value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) return "Document number is required";
    
    switch (type) {
        case 'aadhar':
            if (!/^\d{12}$/.test(trimmed)) return "Aadhar must be a 12-digit number";
            break;
        case 'pan':
            if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(trimmed)) return "Invalid PAN format (e.g. ABCDE1234F)";
            break;
        case 'voters_id':
            if (!/^[a-zA-Z0-9]{10}$/.test(trimmed)) return "Invalid Voter ID format";
            break;
        case 'driving_license':
            if (trimmed.length < 10) return "Invalid Driving License format";
            break;
    }
    
    return null;
};

export const validateIfsc = (value: string): string | null => {
    const trimmed = value.toUpperCase().trim();
    if (!trimmed) return "IFSC code is required";
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(trimmed)) return "Invalid IFSC format (e.g. SBIN0001234)";
    return null;
};

export const validateAccountNumber = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) return "Account number is required";
    if (!/^\d{9,18}$/.test(trimmed)) return "Account number must be 9-18 digits";
    return null;
};

export const validateFile = (file: File): string | null => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    
    const fileName = file.name.toLowerCase();
    const extension = fileName.substring(fileName.lastIndexOf('.'));
    
    if (!allowedExtensions.includes(extension)) {
        return "Invalid file extension. Please upload JPG, PNG or PDF.";
    }
    
    if (!allowedMimeTypes.includes(file.type)) {
        return "Invalid file type. Please upload a valid image or PDF.";
    }
    
    if (file.size > 5 * 1024 * 1024) {
        return "File is too large. Maximum size is 5MB.";
    }
    
    return null;
};
