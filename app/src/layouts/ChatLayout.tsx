import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Container,
  Divider,
  Fab,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks";
import { getMessages, Message, sendMessage } from "../services";

function formatMessages(messages: Message[], userId: string) {
  return messages.map((item: Message) => {
    return { fromMe: item.createdBy === userId, ...item };
  });
}
const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const auth = useAuth();
  const user = auth?.user;
  const userFullName = user?.firstName +" "+user?.lastName;
  const fetchMessages = async () => {
    let results = await getMessages();
    console.log(
      results,
      formatMessages(results, user?.userTenantId),
      user?.userTenantId
    );
    setMessages(formatMessages(results, user?.userTenantId));
  };
  const handleSendMessage = async () => {
    let textArea = document.getElementById(
      "message_textarea"
    ) as HTMLInputElement;
    let messageText = textArea?.value ?? "";
    if (!messageText.trim()) return;
    const messageResponse = await sendMessage({
      body: messageText.trim(),
      channelId: user?.defaultTenantId,
      channelType: "group",
    });
    if (messageResponse) {
      const oldMessages = [
        ...messages,
        ...formatMessages([messageResponse], user?.userTenantId),
      ];
      setMessages(oldMessages);
      textArea.value = "";
    }
  };
  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Container style={{ height: "100vh" }}>
      <Grid
        className="chatSection"
        container
        component={Paper}
        style={{ height: "100%" }}
      >
        <Grid item xs={3} className="borderRight500">
          <List>
            <ListItem button key="RemySharp">
              <ListItemIcon>
                <Avatar
                  alt={userFullName}
                  src={"https://ui-avatars.com/api/?name="+userFullName}
                />
              </ListItemIcon>
              <ListItemText primary={user?.firstName +" "+user?.lastName}></ListItemText>
            </ListItem>
          </List>
          <Divider />
          <Grid item xs={12} style={{ padding: "10px" }}>
            <TextField
              id="outlined-basic-email"
              label="Search"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Divider />
          <List>
            <ListItem button key="RemySharp">
              <ListItemIcon>
                <Avatar
                  alt="Remy Sharp"
                  src="https://material-ui.com/static/images/avatar/1.jpg"
                />
              </ListItemIcon>
              <ListItemText primary="Remy Sharp">Remy Sharp</ListItemText>
              <ListItemText secondary="online"></ListItemText>
            </ListItem>
            <ListItem button key="Alice">
              <ListItemIcon>
                <Avatar
                  alt="Alice"
                  src="https://material-ui.com/static/images/avatar/3.jpg"
                />
              </ListItemIcon>
              <ListItemText primary="Alice">Alice</ListItemText>
            </ListItem>
            <ListItem button key="CindyBaker">
              <ListItemIcon>
                <Avatar
                  alt="Cindy Baker"
                  src="https://material-ui.com/static/images/avatar/2.jpg"
                />
              </ListItemIcon>
              <ListItemText primary="Cindy Baker">Cindy Baker</ListItemText>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={9}>
          <List className="messageArea">
            {messages?.map((message) => {
              return (
                <ListItem key={message?.id}>
                  <Grid container>
                    <Grid item xs={12}>
                      <ListItemText
                        sx={{
                          textAlign: message?.fromMe ? "right" : "left",
                        }}
                        primary={message.body}
                      ></ListItemText>
                    </Grid>
                    <Grid item xs={12}>
                      <ListItemText
                        sx={{
                          textAlign: message?.fromMe ? "right" : "left",
                        }}
                        secondary={new Date(message.createdOn).toLocaleString(
                          "en-US",
                          {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          }
                        )}
                      ></ListItemText>
                    </Grid>
                  </Grid>
                </ListItem>
              );
            })}
          </List>
          <Divider />
          <Grid container style={{ padding: "20px" }}>
            <Grid item xs={11}>
              <TextField
                id="message_textarea"
                label="Type Something"
                fullWidth
                onKeyPress={(key) => {
                  if (key.code === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
            </Grid>
            <Grid xs={1} textAlign="end">
              <Fab color="primary" aria-label="add" onClick={handleSendMessage}>
                <SendIcon />
              </Fab>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Chat;
