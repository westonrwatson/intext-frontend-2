import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography, Paper, IconButton, Tooltip, Button } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';

const columns: GridColDef[] = [
    {
        field: 'edit', headerName: 'Edit', width: 80, renderCell: () => (
            <Tooltip title="Edit">
                <IconButton size="small" color="primary">
                    <Edit fontSize="small" />
                </IconButton>
            </Tooltip>
        )
    },
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'director', headerName: 'Director', flex: 1 },
    { field: 'cast', headerName: 'Cast', flex: 1 },
    { field: 'country', headerName: 'Country', width: 100 },
    { field: 'releaseYear', headerName: 'Release Year', width: 130 },
    { field: 'rating', headerName: 'Rating', width: 100 },
    { field: 'duration', headerName: 'Duration', width: 100 },
    { field: 'description', headerName: 'Description', flex: 2 },
    { field: 'genre', headerName: 'Genre', width: 160 }
];

interface RowData {
    id: string;
    title: string;
    director: string;
    cast: string;
    country: string;
    releaseYear: number;
    rating: string;
    duration: string;
    description: string;
    genre: string;
}

const rows: RowData[] = Array.from({ length: 10 }).map((_, i) => ({
    id: `s1`,
    title: 'Dick Johnson Is Dead',
    director: 'Kirsten Johnson',
    cast: 'Michael Hilow, ...',
    country: 'US',
    releaseYear: 2020,
    rating: 'PG-13',
    duration: '90 min',
    description: 'As her father ne...',
    genre: 'Documentaries'
}));

export default function Admin() {
    const [pageSize, setPageSize] = useState(10);

    return (
        <Box className="bg-[#191919] mt-20 h-full text-white">
            <Box className="flex flex-row items-center gap-4 p-6 border-b border-zinc-700">
                <Typography variant="h5" className="font-bold text-white">
                    Manage Movies
                </Typography>
                <Button variant="outlined" className="text-white border-zinc-500">
                    Column picker
                </Button>
                <Button variant="contained" color="primary" startIcon={<Add />}>
                    Add New Movie
                </Button>
                <Button variant="outlined" color="error" startIcon={<Delete />}>
                    Delete Selected Rows
                </Button>
            </Box>

            <Box className="px-6 pb-10">
                <Paper className="bg-[#383838] text-white rounded-lg overflow-hidden">
                    <DataGrid
                        rows={rows as RowData[]}
                        columns={columns as GridColDef[]}
                        checkboxSelection
                        onPaginationModelChange={(model) => setPageSize(model.pageSize)}
                        paginationModel={{ pageSize, page: 0 }}
                        pageSizeOptions={[5, 10, 25, 50]}
                        pagination
                        autoHeight
                        sx={{
                            color: '#e0e0e0', // general cell text
                            borderColor: '#2c2c2c',
                            backgroundColor: '#191919',
                            fontSize: '0.875rem',

                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid #2c2c2c',
                            },

                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#121212',
                                borderBottom: '1px solid #2c2c2c',
                                color: '#e0e0e0',
                                fontWeight: 600,
                            },

                            '& .MuiDataGrid-footerContainer': {
                                backgroundColor: '#121212',
                                color: '#e0e0e0',
                                borderTop: '1px solid #2c2c2c',
                                fontWeight: 500,
                            },

                            '& .MuiCheckbox-root svg': {
                                fill: '#aaa',
                            },

                            '& .MuiDataGrid-row:hover': {
                                backgroundColor: '#2a2a2a',
                            },

                            '& .Mui-selected': {
                                backgroundColor: '#333 !important',
                            },

                            '& .MuiButtonBase-root.Mui-disabled': {
                                color: '#666',
                            },

                            '& .MuiDataGrid-iconSeparator': {
                                display: 'none',
                            },
                        }}
                    />
                </Paper>
            </Box>
        </Box>
    );
}
