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
  Create,
  Devices,
  Favorite,
  Group,
  MenuBook,
} from "@mui/icons-material";

const KeyFeatures = () => {
  return (
    <Container sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h2"
        align="center"
        color="primary"
        gutterBottom
      >
        Unlock the Magic of TalePod
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        gutterBottom
      >
        Discover the amazing features that make TalePod the ultimate bedtime
        story creator.
      </Typography>
      <Grid container spacing={3} sx={{
        mt: 2
      }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 2
                }}>
                <Create color="primary" fontSize="large" />
              </Box>
              <Typography variant="h6">Personalized Stories</Typography>
              <Typography variant="body2" sx={{
                color: "text.secondary"
              }}>
                Craft unique stories tailored to your child's interests,
                creating magical adventures just for them.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 2
                }}>
                <ChildCare color="primary" fontSize="large" />
              </Box>
              <Typography variant="h6">Easy to Use</Typography>
              <Typography variant="body2" sx={{
                color: "text.secondary"
              }}>
                Our simple interface makes story creation quick and effortless,
                even for the busiest parents.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 2
                }}>
                <MenuBook color="primary" fontSize="large" />
              </Box>
              <Typography variant="h6">Unlimited Creativity</Typography>
              <Typography variant="body2" sx={{
                color: "text.secondary"
              }}>
                Explore endless possibilities with a vast library of characters,
                settings, and plot ideas.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 2
                }}>
                <Favorite color="primary" fontSize="large" />
              </Box>
              <Typography variant="h6">Engaging Content</Typography>
              <Typography variant="body2" sx={{
                color: "text.secondary"
              }}>
                Create stories that captivate and entertain, making bedtime
                something to look forward to.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 2
                }}>
                <Group color="primary" fontSize="large" />
              </Box>
              <Typography variant="h6">Save & Share</Typography>
              <Typography variant="body2" sx={{
                color: "text.secondary"
              }}>
                Save your favorite stories and share them with family and
                friends, creating lasting memories.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 2
                }}>
                <Devices color="primary" fontSize="large" />
              </Box>
              <Typography variant="h6">Multi-Device Access</Typography>
              <Typography variant="body2" sx={{
                color: "text.secondary"
              }}>
                Access your stories from any device, making bedtime stories
                available wherever you are.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default KeyFeatures;
