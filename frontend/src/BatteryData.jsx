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

    const [yFirstValue, setYFirstValue] = useState('');
    const [ySecondValue, setYSecondValue] = useState('');

    const [dataChart, setDataChart] = useState({
        xAxis: [0],
        yFirstAxis: [0],
        ySecondAxis: [0]
    });

    useEffect(() => {
        BatteryService.getAll(page + 1, limit, profile)
            .then((result) => {
                if (result instanceof Error) {
                    console.log(result.message);
                } else {
                    setRows(result.data);
                    setTotalRecords(result.total);
                }
            })
            .catch((error) => {
                console.error('Erro ao buscar dados:', error);
            });
    }, [page, limit, profile]);

    useEffect(() => {
        let xAxisData = [0];
        let yFirstData = [0];
        let ySecondData = [0];

        if (rows.length !== 0) {
            xAxisData = rows.map((item) => item['test_time(s)']);
        }

        if (rows.length !== 0 && yFirstValue !== '') {
            yFirstData = rows.map((item) => {
                if (profile !== '') {
                    return item['profile'] === profile && item[yFirstValue];
                }
                return item[yFirstValue];
            });
        }

        if (rows.length !== 0 && ySecondValue !== '') {
            ySecondData = rows.map((item) => {
                if (profile !== '') {
                    return item['profile'] === profile && item[ySecondValue];
                }
                return item[ySecondValue];
            });
        }

        setDataChart({
            xAxis: xAxisData,
            yFirstAxis: yFirstData,
            ySecondAxis: ySecondData
        });
    }, [profile, rows, yFirstValue, ySecondValue]);

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
                            data: dataChart.yFirstAxis,
                            label: yFirstValue,
                            showMark: false,
                            yAxisKey: 'left'
                        },
                        {
                            curve: 'linear',
                            data: dataChart.ySecondAxis,
                            label: ySecondValue,
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
                    xAxis={[{ data: dataChart.xAxis }]}
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
                <FormControl sx={{ width: '15%', marginRight: 2, marginTop: 1 }}>
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
                <FormControl sx={{ width: '15%', marginRight: 2, marginTop: 1 }}>
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
                <FormControl sx={{ width: '10%', marginRight: 2, marginTop: 1 }}>
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
                                <TableCell align='center'>Profile </TableCell>
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
                                    <TableCell align='center'>{row['profile']}</TableCell>
                                    <TableCell align='center'>
                                        {parseFloat(row['charge_capacity(Ah)']).toFixed(3)}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {parseFloat(row['charge_energy(Wh)']).toFixed(3)}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {parseFloat(row['current(A)']).toFixed(3)}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {parseFloat(row['discharge_capacity(Ah)']).toFixed(3)}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {parseFloat(row['discharge_energy(Wh)']).toFixed(3)}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {parseFloat(row['mAh/g']).toFixed(3)}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {parseFloat(row['power(W)']).toFixed(3)}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {parseFloat(row['step_index']).toFixed(3)}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {parseFloat(row['step_time(s)']).toFixed(3)}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {parseFloat(row['test_time(s)']).toFixed(3)}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {parseFloat(row['volt/cell(V)']).toFixed(3)}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {parseFloat(row['voltage(V)']).toFixed(3)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    ActionsComponent={paginationActions}
                                    colSpan={14}
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
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
}
