import React, { useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Stack,
  Pagination,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import {
  
  useGetAllPosts,
} from "../../hooks/react-query/query-hooks/blogQuery";

import {
  
  useFilterBlogCategory,
  useGetBlogCategory,
} from "../../hooks/react-query/query-hooks/blogCategoryQuery";

const Blogs = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const postsPerPage = 6;
  const [selectedCategory, setSelectedCategory] = useState("");


  const { data: categoryData } = useGetBlogCategory();

  const {
    data: allPostsData,
    isLoading: isLoadingAll,
    isError: isErrorAll,
  } = useGetAllPosts();

  const {
    data: filteredData,
    isLoading: isLoadingFiltered,
    isError: isErrorFiltered,
  } = useFilterBlogCategory(selectedCategory);

  const isFiltering = selectedCategory !== "";
  const posts = isFiltering
    ? filteredData?.data?.post || []
    : allPostsData?.data || [];

  const isLoading = isFiltering ? isLoadingFiltered : isLoadingAll;
  const isError = isFiltering ? isErrorFiltered : isErrorAll;

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const paginatedPosts = posts.slice(
    (page - 1) * postsPerPage,
    page * postsPerPage
  );

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  return (
    <Container sx={{ mt: 15, mb: 10 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box flexGrow={1} display="flex" justifyContent="center">
          <Typography variant="h4" textAlign="center">
            Blog Posts
          </Typography>
        </Box>
        <Button variant="contained" color="primary" onClick={() => navigate("/create-blog")}>
          Add Blog
        </Button>
      </Box>

      {/* Category Filter */}
      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel>Filter by Category</InputLabel>
        <Select
          value={selectedCategory}
          label="Filter by Category"
          onChange={handleCategoryChange}
        >
          <MenuItem value="">All</MenuItem>
          {categoryData?.data?.map((cat) => (
            <MenuItem key={cat._id} value={cat._id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Loader / Error */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Typography color="error" align="center" mt={4}>
          Failed to load blogs.
        </Typography>
      ) : (
        <>
          {/* Blog Cards */}
          <Grid container spacing={3}>
            {paginatedPosts.map((post) => {
              const imageUrl = post?.image
                ? `https://expensifybackend.onrender.com/${post.image.replace(/\\/g, "/")}`
                : "";

              return (
                <Grid item xs={12} sm={6} md={4} key={post._id}>
                  <Card
                    sx={{ height: "100%", display: "flex", flexDirection: "column" }}
                  >
                    {imageUrl && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={imageUrl}
                        alt={post.title}
                        sx={{ objectFit: "cover" }}
                      />
                    )}
                    <CardContent>
                      <Typography variant="h6" component="div" gutterBottom noWrap>
                        {post.title}
                      </Typography>

                      {/* Tags */}
                      <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
                        {post.tags?.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            color="secondary"
                            sx={{ mb: 0.5 }}
                          />
                        ))}
                      </Stack>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                        noWrap
                      >
                        {post.content}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        Author: {post.author?.name || "Unknown"}
                      </Typography>
                    </CardContent>

                    <CardActions sx={{ mt: "auto" }}>
                      <Button size="small" variant="outlined" component={Link} to={`/blog-details/${post._id}`}>
                        Read More
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Pagination */}
          <Box display="flex" justifyContent="center" mt={6}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default Blogs;
