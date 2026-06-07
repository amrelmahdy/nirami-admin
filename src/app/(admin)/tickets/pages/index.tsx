import { useState } from 'react'
import { Button, Card, CardBody, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

import PageMetaData from '@/components/PageTitle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { Group, useDeleteGroup, useGetGroups } from '../../groups/groups.hooks'
import { useGetCategories } from '../../categories/categories.hooks'
import { Order, useGetOrdres } from '../orders.hooks'
import moment from 'moment';
import { useGetTickets } from '../tickets.hooks'
import { get } from 'http'
import { getTicketStatus, getTicketStatusBadge, getTicketType } from '@/helpers/data'







const Tickets = () => {

    const navigate = useNavigate();


    const { data: ticketsList, isTicketsError, isTicketsLoading } = useGetTickets();



    const [selectedGroup, setSelectedGroup] = useState<Group | undefined>(undefined);


    const deleteGroup = useDeleteGroup();


    const handleDeleteClick = (group: Group) => {
        setSelectedGroup(group);
    };

    const handleCloseModal = () => {
        setSelectedGroup(undefined);
    };


    const handleDeleteModal = (id: string) => {
        deleteGroup.mutate(id)
        handleCloseModal();
    };







    return (
        <>
            <PageMetaData title="الطلبات" />

            {isTicketsLoading && <Spinner />}

            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <div className="d-flex flex-wrap justify-content-between gap-3">
                                {/* <div className="search-bar">
                                    <span>
                                        <IconifyIcon icon="bx:search-alt" className="mb-1" />
                                    </span>
                                    <input type="search" className="form-control" id="search" placeholder="البحث في المنتجات ..." />
                                </div> */}
                                {/* <div>
                                    <Button onClick={() => navigate("/groups/create")} variant="success">
                                        <IconifyIcon icon="bx:plus" className="me-1" />
                                        إضافة فئة
                                    </Button>
                                </div> */}
                            </div>
                        </CardBody>
                        <div>
                            <div className="table-responsive table-centered">
                                <table className="table text-nowrap mb-0">
                                    <thead className="bg-light bg-opacity-50">
                                        <tr>
                                            <th className="border-0 py-2">التذكرة</th>
                                             <th className="border-0 py-2">نوع التذكرة</th>
                                            <th className="border-0 py-2">رقم الطلب</th>
                                            <th className="border-0 py-2">العميل</th>
                                            <th className="border-0 py-2">حالة التذكرة</th>
                                            <th className="border-0 py-2">وقت التذكرة</th>
                                            <th className="border-0 py-2">وقت آخر تحديث</th>


                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!isTicketsError && !isTicketsLoading && ticketsList?.map((ticket: any, idx) => (
                                            <tr key={idx}>


                                                <td>
                                                    <Link to={`/tickets/${ticket?._id}`} className="fw-medium">
                                                        #{ }{ticket?.ticketNumber}
                                                    </Link>
                                                </td>
                                                 <td>
                                                    <span>
                                                        {getTicketType(ticket?.type)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <Link to={`/orders/${ticket?.orderNumber}`} className="fw-medium">
                                                        #{ticket?.orderNumber}
                                                    </Link>
                                                </td>
                                                <td>
                                                    <span>
                                                        {ticket?.name}
                                                    </span>
                                                </td>
                                                {/* <td>
                                                    <div>
                                                        <h5 className="fs-14 mt-1 fw-normal">{order.finalPrice}</h5>
                                                    </div>
                                                </td> */}

                                                <td>
                                                    <span
                                                        className={getTicketStatusBadge(ticket.status)}>
                                                        { getTicketStatus(ticket?.status)}
                                                    </span>
                                                </td>

                                                {/* <td>
                                                    <div>
                                                        <h5 className="fs-14 mt-1 fw-normal">{order?.paymentMethod}</h5>
                                                    </div>
                                                </td> */}

                                                <td>
                                                    <div>
                                                        <h5 className="fs-14 mt-1 fw-normal">{moment(ticket.createdAt).format('DD MMM YYYY, HH:mm')}</h5>
                                                    </div>
                                                </td>

                                                <td>
                                                    <div>
                                                        <h5 className="fs-14 mt-1 fw-normal">{moment(ticket.updatedAt).locale('ar_SA').fromNow()}</h5>
                                                    </div>
                                                </td>



                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* <div className="align-items-center justify-content-between row g-0 text-center text-sm-start p-3 border-top">
                                <div className="col-sm">
                                    <div className="text-muted">
                                        عرض&nbsp;
                                        <span className="fw-semibold">10</span>&nbsp; من&nbsp;
                                        <span className="fw-semibold">52</span>&nbsp; منتج
                                    </div>
                                </div>
                                <Col sm="auto" className="mt-3 mt-sm-0">
                                    <ul className="pagination pagination-rounded m-0">
                                        <li className="page-item">
                                            <Link to="" className="page-link">
                                                <IconifyIcon icon="bx:left-arrow-alt" />
                                            </Link>
                                        </li>
                                        <li className="page-item active">
                                            <Link to="" className="page-link">
                                                1
                                            </Link>
                                        </li>
                                        <li className="page-item">
                                            <Link to="" className="page-link">
                                                2
                                            </Link>
                                        </li>
                                        <li className="page-item">
                                            <Link to="" className="page-link">
                                                3
                                            </Link>
                                        </li>
                                        <li className="page-item">
                                            <Link to="" className="page-link">
                                                <IconifyIcon icon="bx:right-arrow-alt" />
                                            </Link>
                                        </li>
                                    </ul>
                                </Col>
                            </div> */}
                        </div>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default Tickets