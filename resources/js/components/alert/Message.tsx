import React from "react";
import Alert, {AlertProps} from "@mui/material/Alert";

interface MessageProps {
    variant?: AlertProps['severity'];
    children: React.ReactNode;
}

const Message: React.FC<MessageProps> = ({ variant = "info", children }) => {
    return <Alert severity={variant}>{children}</Alert>;
};

export default Message;
