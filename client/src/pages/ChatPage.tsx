import {Box, Stack, Typography} from "@mui/material";

export function ChatPage() {
    return (
        <Stack spacing={2}>
            {Array.from({length: 20}, () => (
                <Message own={Boolean(Math.random() < 0.5)}/>
            ))}
        </Stack>
    )
}

const Message = (props: { own: boolean }) => (
    <Box bgcolor={props.own ? "lightblue" : "white"} borderRadius={2} padding={2} sx={{
        alignSelf: props.own ? "flex-end" : "flex-start",
        maxWidth: "50%",
    }}>
        {Math.random() < 0.9 ? <>
            <Typography variant="body1" align={props.own ? "right" : "left"}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla mattis, dui vel fermentum
                ullamcorper,
                enim
                justo tincidunt libero, in aliquam velit dolor non libero.
            </Typography>
            <Typography variant="body2" color={props.own ? "steelblue" : "gray"}
                        align="right">20/12/2024</Typography>
        </> : <Box
            component="img"
            alt="trash"
            src="http://www.quickmeme.com/img/c4/c4117905ec08b0df9aaf8c4a19433f31e1b62ea8f6d1680ccd2c3449ac9141bf.jpg"
            sx={{
                width: "100%", // Make the image responsive
                height: "auto", // Maintain aspect ratio
                borderRadius: 2, // Match the parent box styling
            }}
        />}
    </Box>
)