import {
    FirstPage as FirstPageIcon,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    LastPage as LastPageIcon
} from '@mui/icons-material';
import {
    Box,
    CssBaseline,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow
} from '@mui/material';
import { LineChart } from '@mui/x-charts';
import { useEffect, useState } from 'react';
import { BatteryService } from './services/BatteryService';

function paginationActions(values) {
    const { count, page, rowsPerPage, onPageChange } = values;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, marginLeft: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}>
                {<FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}>
                {<KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
                {<KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
                {<LastPageIcon />}
            </IconButton>
        </Box>
    );
}

export default function BatteryData() {
    const [limit, setLimit] = useState(100);
    const [page, setPage] = useState(0);
    const [profile, setProfile] = useState('');
    const [rows, setRows] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [xAxis, setXAxis] = useState([0]);
    const [yFirstAxis, setYFirstAxis] = useState([0]);
    const [yFirstValue, setYFirstValue] = useState('');
    const [ySecondAxis, setYSecondAxis] = useState([0]);
    const [ySecondValue, setYSecondValue] = useState('');

    useEffect(() => {
        BatteryService.getAll(page + 1, limit, profile)
            .then((result) => {
                if (result instanceof Error) {
                    console.log(result.message);
                } else {
                    setRows(result.data);
                    setTotalRecords(result.total);

                    const xAxisData = result.data.map((item) => item['step_time(s)']);
                    setXAxis(xAxisData);

                    const yFirstData = result.data.map((item) => item[yFirstValue]);
                    setYFirstAxis(yFirstData);

                    const ySecondData = result.data.map((item) => item[ySecondValue]);
                    setYSecondAxis(ySecondData);
                }
            })
            .catch((error) => {
                console.error('Erro ao buscar dados:', error);
            });
    }, [page, limit, profile, yFirstAxis, ySecondAxis]);

    return (
        <>
            <CssBaseline />
            <Box
                component={Paper}
                elevation={0}
                margin={2}
                variant='outlined'>
                <LineChart
                    height={500}
                    leftAxis='left'
                    rightAxis='right'
                    series={[
                        {
                            curve: 'linear',
                            data: yFirstAxis,
                            label: yFirstValue ? yFirstValue : undefined,
                            showMark: false,
                            yAxisKey: 'left'
                        },
                        {
                            curve: 'linear',
                            data: ySecondAxis,
                            label: ySecondValue ? ySecondValue : undefined,
                            showMark: false,
                            yAxisKey: 'right'
                        }
                    ]}
                    slotProps={{
                        legend: {
                            itemGap: 24,
                            itemMarkHeight: 12,
                            itemMarkWidth: 12,
                            labelStyle: { fontSize: 14 }
                        }
                    }}
                    xAxis={[{ data: xAxis }]}
                    yAxis={[{ id: 'left' }, { id: 'right' }]}
                />
            </Box>
            <Box
                component={Paper}
                display={'flex'}
                elevation={0}
                justifyContent={'flex-end'}
                margin={2}
                padding={2}
                variant='outlined'>
                <FormControl sx={{ width: '15%', marginRight: 2 }}>
                    <InputLabel
                        id='first_value'
                        size='small'>
                        First Value
                    </InputLabel>
                    <Select
                        id='first_value'
                        label='First Value'
                        onChange={(event) => setYFirstValue(event.target.value)}
                        size='small'
                        value={yFirstValue}>
                        <MenuItem value=''>Nenhum</MenuItem>
                        <MenuItem value='charge_capacity(Ah)'>Charge(Ah)</MenuItem>
                        <MenuItem value='charge_energy(Wh)'>Charge(Wh)</MenuItem>
                        <MenuItem value='current(A)'>Current(A)</MenuItem>
                        <MenuItem value='discharge_capacity(Ah)'>Discharge(Ah)</MenuItem>
                        <MenuItem value='discharge_energy(Wh)'>Discharge(Wh)</MenuItem>
                        <MenuItem value='mAh/g'>mAh/g</MenuItem>
                        <MenuItem value='power(W)'>Power(W)</MenuItem>
                        <MenuItem value='volt/cell(V)'>Volt/Cell(V)</MenuItem>
                        <MenuItem value='voltage(V)'>Voltage(V)</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ width: '15%', marginRight: 2 }}>
                    <InputLabel
                        id='second_value'
                        size='small'>
                        Second Value
                    </InputLabel>
                    <Select
                        id='second_value'
                        label='Second Value'
                        onChange={(event) => setYSecondValue(event.target.value)}
                        size='small'
                        value={ySecondValue}>
                        <MenuItem value=''>Nenhum</MenuItem>
                        <MenuItem value='charge_capacity(Ah)'>Charge(Ah)</MenuItem>
                        <MenuItem value='charge_energy(Wh)'>Charge(Wh)</MenuItem>
                        <MenuItem value='current(A)'>Current(A)</MenuItem>
                        <MenuItem value='discharge_capacity(Ah)'>Discharge(Ah)</MenuItem>
                        <MenuItem value='discharge_energy(Wh)'>Discharge(Wh)</MenuItem>
                        <MenuItem value='mAh/g'>mAh/g</MenuItem>
                        <MenuItem value='power(W)'>Power(W)</MenuItem>
                        <MenuItem value='volt/cell(V)'>Volt/Cell(V)</MenuItem>
                        <MenuItem value='voltage(V)'>Voltage(V)</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ width: '10%', marginRight: 2 }}>
                    <InputLabel
                        id='profile'
                        size='small'>
                        Profile
                    </InputLabel>
                    <Select
                        id='profile'
                        label='Profile'
                        onChange={(event) => setProfile(event.target.value)}
                        size='small'
                        value={profile}>
                        <MenuItem value='arbin'>Arbin</MenuItem>
                        <MenuItem value='bk'>BK</MenuItem>
                        <MenuItem value='digatron'>Digatron</MenuItem>
                        <MenuItem value='hh'>HH</MenuItem>
                        <MenuItem value='itech'>Itech</MenuItem>
                        <MenuItem value='regatron'>Regatron</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box
                component={Paper}
                elevation={0}
                variant='outlined'
                margin={2}
                overflow={'hidden'}>
                <TableContainer sx={{ maxHeight: 600 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell align='center'>Id </TableCell>
                                <TableCell align='center'>Charge(Ah)</TableCell>
                                <TableCell align='center'>Charge(Wh)</TableCell>
                                <TableCell align='center'>Current(A)</TableCell>
                                <TableCell align='center'>Discharge(Ah)</TableCell>
                                <TableCell align='center'>Discharge(Wh)</TableCell>
                                <TableCell align='center'>mAh/g</TableCell>
                                <TableCell align='center'>Power(W)</TableCell>
                                <TableCell align='center'>Step Index</TableCell>
                                <TableCell align='center'>Step Time(s)</TableCell>
                                <TableCell align='center'>Test Time(s)</TableCell>
                                <TableCell align='center'>Volt/Cell(V)</TableCell>
                                <TableCell align='center'>Voltage(V)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row['id']}>
                                    <TableCell align='center'>{row['id']}</TableCell>
                                    <TableCell align='center'>
                                        {row['charge_capacity(Ah)'].toFixed(4)}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {row['charge_energy(Wh)'].toFixed(4)}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {row['current(A)'].toFixed(4)}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {row['discharge_capacity(Ah)'].toFixed(4)}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {row['discharge_energy(Wh)'].toFixed(4)}
                                    </TableCell>
                                    <TableCell align='center'>{row['mAh/g'].toFixed(4)}</TableCell>
                                    <TableCell align='center'>
                                        {row['power(W)'].toFixed(4)}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {row['step_index'].toFixed(4)}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {row['step_time(s)'].toFixed(4)}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {row['test_time(s)'].toFixed(4)}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {row['volt/cell(V)'].toFixed(4)}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {row['voltage(V)'].toFixed(4)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TablePagination
                                ActionsComponent={paginationActions}
                                colSpan={13}
                                count={totalRecords}
                                onPageChange={(event, page) => setPage(page)}
                                onRowsPerPageChange={(event) => {
                                    setLimit(parseInt(event.target.value, 10));
                                    setPage(1);
                                }}
                                page={page}
                                rowsPerPage={limit}
                                rowsPerPageOptions={[100, 500, 1000]}
                            />
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
}
