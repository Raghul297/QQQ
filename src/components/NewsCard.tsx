import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Tooltip,
  Link,
  Avatar,
  IconButton,
  Snackbar,
  CardActionArea,
  CardActions,
  Divider,
  useTheme,
  Skeleton,
  Fade,
  useMediaQuery,
} from "@mui/material";
import {
  MoodOutlined,
  SentimentNeutralOutlined,
  MoodBadOutlined,
  WhatsApp,
  Facebook,
  Twitter,
  LinkedIn,
  ContentCopy,
  Share,
  AccessTime,
  LocationOn,
  Person,
  Bookmark,
  BookmarkBorder,
} from "@mui/icons-material";

interface NewsCardProps {
  title: string;
  summary: string;
  topic: string;
  sentiment: number;
  source: string;
  entities: {
    states: string[];
    people: string[];
  };
  timestamp: string;
  url?: string;
}

const getSourceColor = (source: string): string => {
  switch (source) {
    case "Hindustan Times":
      return "#00b1cd";
    case "NDTV":
      return "#e40000";
    case "Times of India":
      return "#ff0000";
    case "The Hindu":
      return "#055699";
    default:
      return "#666666";
  }
};

const getSourceInitials = (source: string): string => {
  return source
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

const getSentimentColor = (sentiment: number): string => {
  if (sentiment >= 0.3) return "#4caf50"; // Green
  if (sentiment >= -0.3) return "#ffc107"; // Yellow
  return "#f44336"; // Red
};

const getSentimentLabel = (sentiment: number): string => {
  const percentage = (((sentiment + 1) / 2) * 100).toFixed(0);
  let label = `${percentage}% - `;
  if (sentiment >= 0.3) label += "Positive";
  else if (sentiment >= -0.3) label += "Neutral";
  else label += "Negative";
  return label;
};

const getSentimentIcon = (sentiment: number) => {
  if (sentiment >= 0.3) return <MoodOutlined />;
  if (sentiment >= -0.3) return <SentimentNeutralOutlined />;
  return <MoodBadOutlined />;
};

const NewsCard = ({
  title,
  summary,
  topic,
  sentiment,
  source,
  entities,
  timestamp,
  url,
}: NewsCardProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullSummary, setShowFullSummary] = useState(false);

  const sentimentColor = getSentimentColor(sentiment);
  const sentimentLabel = getSentimentLabel(sentiment);
  const sentimentIcon = getSentimentIcon(sentiment);
  const sourceColor = getSourceColor(source);

  React.useEffect(() => {
    // Simulate content loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleShare = async (platform: string) => {
    try {
      const shareText = `${title} - Read more at:`;
      const encodedUrl = encodeURIComponent(url || window.location.href);
      const encodedText = encodeURIComponent(shareText);

      let shareUrl = "";
      switch (platform) {
        case "whatsapp":
          shareUrl = `https://wa.me/?text=${encodedText} ${encodedUrl}`;
          break;
        case "facebook":
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
          break;
        case "twitter":
          shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
          break;
        case "linkedin":
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
          break;
        case "copy":
          await navigator.clipboard.writeText(url || window.location.href);
          setShowSnackbar(true);
          return;
      }

      if (shareUrl) {
        window.open(shareUrl, "_blank", "width=600,height=400");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      setShowSnackbar(true);
    }
  };

  const truncatedSummary =
    summary.length > 150 && !showFullSummary
      ? `${summary.substring(0, 150)}...`
      : summary;

  return (
    <Fade in={!isLoading} timeout={500}>
      <Card
        sx={{
          mb: 2,
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: theme.shadows[8],
          },
          borderRadius: 2,
          overflow: "hidden",
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.background.paper
              : "#fff",
          position: "relative",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isLoading ? (
          <CardContent sx={{ p: 3 }}>
            <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
            <Skeleton variant="text" height={60} />
            <Skeleton variant="text" height={20} width="80%" />
            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              <Skeleton variant="rectangular" width={80} height={24} />
              <Skeleton variant="rectangular" width={80} height={24} />
            </Box>
          </CardContent>
        ) : (
          <CardContent sx={{ p: 3 }}>
            {/* Source and Time Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2.5,
                pb: 2,
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: sourceColor,
                    width: 40,
                    height: 40,
                    fontSize: "1rem",
                    mr: 1.5,
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  {getSourceInitials(source)}
                </Avatar>
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: sourceColor,
                      fontWeight: "bold",
                      lineHeight: 1.2,
                    }}
                  >
                    {source}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <AccessTime sx={{ fontSize: 14 }} />
                    {new Date(timestamp).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={() => setIsBookmarked(!isBookmarked)}
                sx={{
                  color: isBookmarked
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              >
                {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
              </IconButton>
            </Box>

            {/* Title and Summary */}
            <CardActionArea
              component="a"
              href={url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (!url) {
                  e.preventDefault();
                }
              }}
              sx={{
                mb: 2,
                borderRadius: 1,
                textDecoration: "none",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  lineHeight: 1.3,
                  mb: 2,
                  color: theme.palette.text.primary,
                }}
              >
                {title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  lineHeight: 1.6,
                  mb: 2,
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowFullSummary(!showFullSummary);
                }}
              >
                {truncatedSummary}
                {summary.length > 150 && (
                  <Typography
                    component="span"
                    sx={{
                      color: theme.palette.primary.main,
                      ml: 1,
                      cursor: "pointer",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {showFullSummary ? "Show less" : "Read more"}
                  </Typography>
                )}
              </Typography>
            </CardActionArea>

            {/* Topics and Entities */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mb: 3,
                flexWrap: "wrap",
                maxWidth: "100%",
                overflow: "auto",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                pb: 1,
              }}
            >
              <Chip
                label={topic}
                color="primary"
                size="small"
                sx={{
                  textTransform: "capitalize",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                  transition: "transform 0.2s",
                }}
              />
              {entities.states.map((state) => (
                <Chip
                  key={state}
                  icon={<LocationOn sx={{ fontSize: 16 }} />}
                  label={state}
                  variant="outlined"
                  size="small"
                  sx={{
                    textTransform: "capitalize",
                    borderRadius: "8px",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                    transition: "transform 0.2s",
                    borderColor:
                      theme.palette.mode === "dark"
                        ? theme.palette.grey[700]
                        : theme.palette.grey[300],
                  }}
                />
              ))}
              {entities.people.map((person) => (
                <Chip
                  key={person}
                  icon={<Person sx={{ fontSize: 16 }} />}
                  label={person}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: theme.palette.secondary.main,
                    color: theme.palette.secondary.main,
                    borderRadius: "8px",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                    transition: "transform 0.2s",
                  }}
                />
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Sentiment and Share Buttons */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mt: 2,
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 2 : 0,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.03)",
                  borderRadius: 2,
                  padding: "4px 12px",
                }}
              >
                <Tooltip title="Sentiment Analysis">
                  <Box
                    sx={{
                      color: sentimentColor,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {sentimentIcon}
                  </Box>
                </Tooltip>
                <Chip
                  label={sentimentLabel}
                  size="small"
                  sx={{
                    backgroundColor: sentimentColor,
                    color: "white",
                    "& .MuiChip-label": {
                      fontWeight: "bold",
                    },
                    borderRadius: "8px",
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  backgroundColor: isHovered
                    ? theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.03)"
                    : "transparent",
                  borderRadius: 2,
                  padding: "4px 8px",
                  transition: "all 0.3s ease",
                  width: isMobile ? "100%" : "auto",
                  justifyContent: isMobile ? "center" : "flex-end",
                }}
              >
                <Tooltip title="Share on WhatsApp">
                  <IconButton
                    size="small"
                    onClick={() => handleShare("whatsapp")}
                    sx={{
                      color: "#25D366",
                      "&:hover": {
                        transform: "scale(1.1)",
                        backgroundColor: "rgba(37, 211, 102, 0.1)",
                      },
                    }}
                  >
                    <WhatsApp />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Share on Facebook">
                  <IconButton
                    size="small"
                    onClick={() => handleShare("facebook")}
                    sx={{
                      color: "#1877F2",
                      "&:hover": {
                        transform: "scale(1.1)",
                        backgroundColor: "rgba(24, 119, 242, 0.1)",
                      },
                    }}
                  >
                    <Facebook />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Share on Twitter">
                  <IconButton
                    size="small"
                    onClick={() => handleShare("twitter")}
                    sx={{
                      color: "#1DA1F2",
                      "&:hover": {
                        transform: "scale(1.1)",
                        backgroundColor: "rgba(29, 161, 242, 0.1)",
                      },
                    }}
                  >
                    <Twitter />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Share on LinkedIn">
                  <IconButton
                    size="small"
                    onClick={() => handleShare("linkedin")}
                    sx={{
                      color: "#0A66C2",
                      "&:hover": {
                        transform: "scale(1.1)",
                        backgroundColor: "rgba(10, 102, 194, 0.1)",
                      },
                    }}
                  >
                    <LinkedIn />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Copy Link">
                  <IconButton
                    size="small"
                    onClick={() => handleShare("copy")}
                    sx={{
                      color:
                        theme.palette.mode === "dark"
                          ? theme.palette.grey[400]
                          : theme.palette.grey[700],
                      "&:hover": {
                        transform: "scale(1.1)",
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <ContentCopy />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </CardContent>
        )}
        <Snackbar
          open={showSnackbar}
          autoHideDuration={3000}
          onClose={() => setShowSnackbar(false)}
          message="Link copied to clipboard!"
          sx={{
            "& .MuiSnackbarContent-root": {
              backgroundColor: theme.palette.success.main,
              borderRadius: 2,
            },
          }}
        />
      </Card>
    </Fade>
  );
};

export default NewsCard;
