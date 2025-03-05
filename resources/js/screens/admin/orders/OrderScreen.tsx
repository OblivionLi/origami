import React, {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Paper, MenuItem, ListItemIcon, Box, Typography} from "@mui/material";
import Swal from "sweetalert2";
import Loader from "@/components/alert/Loader.js";
import Message from "@/components/alert/Message.js";
import {useNavigate} from "react-router-dom";
import {AppDispatch, RootState} from "@/store";
import {getUserRolesPermissions} from "@/features/user/userSlice";
import {AdminOrder, createPDFOrder, deleteOrder, fetchAdminOrdersList} from "@/features/order/orderSlice";
import {StyledDivider} from "@/styles/muiStyles";
import {MaterialReactTable, MRT_ColumnDef, useMaterialReactTable} from "material-react-table";
import {format} from "date-fns";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from '@mui/icons-material/Download';

interface OrderScreenProps {
}

const OrderScreen: React.FC<OrderScreenProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(false);

    const {
        userInfo,
        userPermissions,
    } = useSelector((state: RootState) => state.user);

    const {
        adminOrdersList,
        loading,
        error,
    } = useSelector((state: RootState) => state.order)

    useEffect(() => {
        if (!userInfo || userInfo?.data?.is_admin != 1) {
            navigate("/login");
        } else {
            setIsAdmin(true);
            dispatch(fetchAdminOrdersList());
        }
    }, [dispatch, userInfo, navigate]);

    useEffect(() => {
        if (!userPermissions || userPermissions?.length === 0) {
            dispatch(getUserRolesPermissions({id: userInfo?.data?.id}));
        }
    }, [dispatch, userPermissions]);

    const handleDownloadInvoice = (id: string) => {
        if (!userPermissions?.includes("admin_view_orders")) {
            Swal.fire(
                "Sorry!",
                `You don't have access to this action.`,
                "warning"
            );

            return;
        }

        dispatch(createPDFOrder({id}))
    }

    const deleteOrderHandler = (id: number) => {
        if (!userPermissions?.includes("admin_delete_orders")) {
            Swal.fire(
                "Sorry!",
                `You don't have access to this action.`,
                "warning"
            );
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: `You can't recover this order after deletion!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            cancelButtonColor: "#d33",
            reverseButtons: true,
        }).then((result) => {
            if (result.value) {
                dispatch(deleteOrder({id}));
                Swal.fire(
                    "Deleted!",
                    "The order with the id " + id + " has been deleted.",
                    "success"
                );
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    "Cancelled",
                    `The selected order is safe, don't worry :)`,
                    "error"
                );
            }
        });
    }

    const columns = useMemo<MRT_ColumnDef<AdminOrder, unknown>[]>(
        () => [
            {
                accessorKey: 'order_id',
                header: 'Order',
                size: 150,
            },
            {
                accessorKey: 'user.name',
                header: 'Ordered By',
                size: 150,
            },
            {
                accessorKey: 'products_count',
                header: 'Items Bought',
                size: 150,
            },
            {
                accessorKey: 'status',
                header: 'Status',
                size: 150,
            },
            {
                accessorKey: 'total_price',
                header: 'Total Price',
                size: 150,
                Cell: ({cell}) => {
                    const totalPrice = cell.getValue<string>();

                    return <span>{`${totalPrice} €`}</span>
                }
            },
            {
                accessorKey: 'is_paid',
                header: 'Is paid?',
                size: 150,
                Cell: ({cell}) => {
                    const isPaid = cell.getValue<number>();

                    return <span>{isPaid == 1 ? 'Yes' : 'No'}</span>
                }
            },
            {
                accessorKey: 'is_delivered',
                header: 'Is delivered?',
                size: 150,
                Cell: ({cell}) => {
                    const isDelivered = cell.getValue<number>();

                    return <span>{isDelivered == 1 ? 'Yes' : 'No'}</span>
                }
            },
            {
                accessorKey: 'paid_at',
                header: 'Paid At',
                size: 150,
                Cell: ({cell}) => {
                    const paidAt = cell.getValue<string>();

                    if (!paidAt) {
                        return <span>"--/--/---- --/--"</span>;
                    }

                    return <span>{format(new Date(paidAt), 'dd/MM/yyyy HH:mm')}</span>
                }
            },
            {
                accessorKey: 'delivered_at',
                header: 'Delivered At',
                size: 150,
                Cell: ({cell}) => {
                    const deliveredAt = cell.getValue<string>();

                    if (!deliveredAt) {
                        return <span>"--/--/---- --/--"</span>;
                    }

                    return <span>{format(new Date(deliveredAt), 'dd/MM/yyyy HH:mm')}</span>
                }
            },
            {
                accessorKey: 'created_at',
                header: 'Created At',
                size: 150,
                Cell: ({cell}) => {
                    const createdAt = cell.getValue<string>();

                    if (!createdAt) {
                        return <span>"--/--/---- --/--"</span>;
                    }

                    return <span>{format(new Date(createdAt), 'dd/MM/yyyy HH:mm')}</span>
                }
            },
            {
                accessorKey: 'updated_at',
                header: 'Updated At',
                size: 150,
                Cell: ({cell}) => {
                    const updated_at = cell.getValue<string>();

                    if (!updated_at) {
                        return <span>"--/--/---- --/--"</span>;
                    }

                    return <span>{format(new Date(updated_at), 'dd/MM/yyyy HH:mm')}</span>
                }
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data: adminOrdersList || [],
        enableRowActions: true,
        enableExpanding: true,
        positionActionsColumn: 'last',
        renderRowActionMenuItems: ({row, closeMenu}) => [
            <MenuItem
                key={0}
                onClick={() => {
                    handleDownloadInvoice(row.original.order_id)
                    closeMenu();
                }}
                sx={{m: 0}}
            >
                <ListItemIcon>
                    <DownloadIcon/>
                </ListItemIcon>
                Download Order Invoice (PDF)
            </MenuItem>,
            <MenuItem
                key={1}
                onClick={() => {
                    deleteOrderHandler(row.original.id!)
                    closeMenu();
                }}
                sx={{m: 0}}
            >
                <ListItemIcon>
                    <DeleteIcon/>
                </ListItemIcon>
                Delete
            </MenuItem>,
        ],
        renderDetailPanel: ({row}) => (
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-around',
                    left: '30px',
                    maxWidth: '1000px',
                    position: 'sticky',
                    width: '100%',
                }}
            >
                <Typography variant="h4">Address To Deliver:</Typography>
                <Box sx={{marginBottom: '8px'}}>
                    <Typography>Name: {row?.original?.user?.address?.name} {row?.original?.user?.address?.surname}</Typography>
                    <Typography>Country: {row?.original?.user?.address?.country}</Typography>
                    <Typography>City: {row?.original?.user?.address?.city}</Typography>
                    <Typography>Address: {row?.original?.user?.address?.address}</Typography>
                    <Typography>Postal Code: {row?.original?.user?.address?.postal_code}</Typography>
                    <Typography>Phone Number: {row?.original?.user?.address?.phone_number}</Typography>
                </Box>
            </Box>
        ),
    });

    return (
        <Paper className="admin-content">
            {!isAdmin ? (
                <div className="admin-loader">
                    <Loader/>
                </div>
            ) : (
                <>
                    <StyledDivider>Orders</StyledDivider>
                    {loading ? (
                        <Loader/>
                    ) : error ? (
                        <Message variant="error">{error}</Message>
                    ) : (
                        <MaterialReactTable table={table}/>
                    )}
                </>
            )}
        </Paper>
    );
};

export default OrderScreen;
