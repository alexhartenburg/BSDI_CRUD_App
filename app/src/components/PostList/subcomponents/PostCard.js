import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const PostCard = (props) => {
  const navigate = useNavigate();
  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const date = props.post.created_at.split('T')[0];
  const time = props.post.created_at.split('T')[1].split('.')[0];
  const timeStamp = `${date.split('-')[2]} ${months[parseInt(date.split('-')[1])]}, ${date.split('-')[0]} at ${time}`;
  let preview = props.post.content;
  if(preview.length > 100){
    preview = preview.substring(0, 100) + '...';
  }

  const readMore = () => {
    navigate(`/post/${props.post.id}`)
  }

  return (
    <Box sx={{ minWidth: '300px', width: '60%', marginTop:'5px' }}>
      <Card variant="outlined">
        <CardContent>
            <Typography sx={{ fontSize: 16, fontWeight: 600 }} color="text.secondary" gutterBottom>
                {props.post.title}
            </Typography>
            <Typography variant="body2">
                {preview}
            </Typography>
            <br />
            <Typography sx={{ fontSize: 12 }} color="text.secondary">
                {`Author: ${props.post.firstName} ${props.post.lastName}`}
            </Typography>
            <Typography sx={{ fontSize: 12 }} color="text.secondary">
                {`Created: ${timeStamp}`}
            </Typography>
        </CardContent>
        <CardActions>
            <Button size="small" onClick={readMore}>Read More</Button>
        </CardActions>
      </Card>
    </Box>
  );
}


export default PostCard;