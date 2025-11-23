import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import {
  ChildCare,
  Favorite,
  Lightbulb,
  MenuBook,
  ScreenShare,
  Star,
} from "@mui/icons-material";

const Benefits = () => {
  return (
    <Container sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h2"
        align="center"
        color="primary"
        gutterBottom
      >
        Why You and Your Child Will Love TalePod
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        gutterBottom
      >
        Discover the many ways TalePod can enhance your family's bedtime
        routine.
      </Typography>
      <Grid container spacing={3} mt={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
            <CardContent>
              <Box display="flex" alignItems="center" p={3}>
                <Lightbulb color="primary" fontSize="large" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Boosts Imagination</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Encourages creativity and imaginative thinking in children.
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
            <CardContent>
              <Box display="flex" alignItems="center" p={3}>
                <Favorite color="primary" fontSize="large" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Strengthens Bonds</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Creates special moments between parents and children.
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
            <CardContent>
              <Box display="flex" alignItems="center" p={3}>
                <MenuBook color="primary" fontSize="large" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Promotes Literacy</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Helps children develop a love for reading and storytelling.
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
            <CardContent>
              <Box display="flex" alignItems="center" p={3}>
                <ChildCare color="primary" fontSize="large" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Customized Learning</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tailor stories to reinforce specific lessons or values.
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
            <CardContent>
              <Box display="flex" alignItems="center" p={3}>
                <Star color="primary" fontSize="large" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Fun and Engaging</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Makes bedtime an exciting and enjoyable experience.
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
            <CardContent>
              <Box display="flex" alignItems="center" p={3}>
                <ScreenShare color="primary" fontSize="large" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Reduces Screen Time</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Offers a creative alternative to passive screen time.
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Benefits;
