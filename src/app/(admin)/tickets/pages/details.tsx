import { useEffect, useState } from 'react'
import { Card, CardBody, CardTitle, Col, Form, Row, Spinner } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'

import { getInvoiceById } from '@/helpers/data'
import { currency } from '@/context/constants'
import PageMetaData from '@/components/PageTitle'
import type { InvoiceType } from '@/types/data'

import logoDark from '@/assets/images/logo-dark-full.png'
import logoLight from '@/assets/images/logo-light-full.png'
import { useGetOrderDetails, useUpdateOrder } from '../../orders/orders.hooks'
import { useGetTicketDetails } from '../tickets.hooks'
import moment from 'moment'

const TicketDetails = () => {
    const [invoice, setInvoice] = useState<InvoiceType>()
    const { ticketId } = useParams()
    const navigate = useNavigate()

    const { data: ticket, isError, isLoading, refetch, isRefetching } = useGetTicketDetails(ticketId || "")

    const updateOrder = useUpdateOrder();



    useEffect(() => {
        // ;(async () => {
        //   if (orderId) {
        //     const data = await getInvoiceById(orderId)
        //     if (data) setInvoice(data)
        //     else navigate('/pages/error-404-alt')
        //   }
        // })()
    }, [])




     const getTicketType = (status: string) => {
        switch (status) {
            case 'complaint':
                return "شكوي";
            case 'inquiry':
                return 'إستفسار';
            case 'return_or_exchange':
                return 'طلب إرجاع أو إستبدال';
            default:
                return 'شكوي';
        }
    }

    return (
        <>
            <PageMetaData title={ticket?.orderNumber ?? 'تفاصيل الطلب'} />

            {
                isLoading || isRefetching && <div className="text-center" style={{

                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    left: 0,
                    top: "50%",
                    zIndex: 111
                }}>
                    <Spinner animation="border" />
                </div >
            }

            <Row>

                <Col xs={12}>


                    {ticket && !isError && (
                        <Card>
                            <CardBody>
                                <div className="clearfix">
                                    <div className="float-sm-end">
                                        <CardTitle as={'h5'} className="mb-2">
                                            رقم التذكرة: #{ticket.ticketNumber}
                                        </CardTitle>

                                        <address className="mt-3">
                                            <h6 className="fw-normal text-muted">إسم العميل</h6>
                                            <h6 className="fs-16">{`${ticket.user.firstName} ${ticket.user.lastName}`}</h6>

                                            <h6 className="fw-normal text-muted">رقم الهاتف</h6>
                                            <h6 className="fs-16">{ticket.phone}</h6>

                                            <h6 className="fw-normal text-muted">البريد الإلكتروني</h6>
                                            <h6 className="fs-16">{ticket.email}</h6>

                                        </address>

                                    </div>
                                    <div className="float-sm-start">

                                        <Form.Select onChange={(e) => {
                                            console.log("changed", e.target.value);
                                            updateOrder.mutate({
                                                id: ticket.id || "",
                                                order: { status: e.target.value }
                                            }, {
                                                onSuccess: () => {
                                                    refetch();
                                                    //navigate("/groups")
                                                }, onError: (error) => {
                                                    //setServerError(error.message || "Unknown error")
                                                }
                                            });


                                        }} aria-label="Default select example">
                                            <option value="">حالة التذكرة</option>
                                            <option selected={ticket.status === "created"} value="created">تم الإنشاء</option>
                                            <option selected={ticket.status === "processing"} value="processing">جاري العمل عليها</option>
                                            <option selected={ticket.status === "completed"} value="completed">تمت</option>
                                            <option selected={ticket.status === "closed"} value="closed">مغلق</option>
                                        </Form.Select>


                                    </div>
                                </div>
                                <Row className="mt-3">
                                    <Col md={6}>

                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12}>
                                        <div className="table-responsive table-borderless text-nowrap mt-3 table-centered">
                                            <table className="table mb-0">
                                                <thead className="bg-light bg-opacity-50">
                                                    <tr>
                                                        <th className="border-0 py-2">رقم الطلب</th>
                                                        <th className="border-0 py-2">نوع التذكرة</th>
                                                        <th className="border-0 py-2">وقت التذكرة</th>
                                                        <th className="text-end border-0 py-2">وقت اخر تحديث</th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    <tr>
                                                        <td>{ticket.orderNumber}</td>
                                                        <td>{getTicketType(ticket.type)}</td>
                                                        <td>{moment(ticket.createdAt).format('DD MMM YYYY, HH:mm')}</td>
                                                         <td>{moment(ticket.updatedAt).format('DD MMM YYYY, HH:mm')}</td>
                                                        {/* <td>{item.quantity}</td>
                                                        <td>{item.unitPrice.toFixed(2)} {currency}</td>
                                                        <td className="text-end">{(item.unitPrice * item.quantity).toFixed(2)} {currency}</td> */}

                                                    </tr>

                                                    {/* {order.items.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{item.product.name.ar}</td>
                                                            <td>{item.quantity}</td>
                                                            <td>{item.unitPrice.toFixed(2)} {currency}</td>
                                                            <td className="text-end">{(item.unitPrice * item.quantity).toFixed(2)} {currency}</td>
                                                          
                                                        </tr>
                                                    ))} */}




                                                </tbody>
                                            </table>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="mt-3">

                                    <Col sm={5}>
                                        <div className="float-end">
                                            <p>الرسالة : </p>
                                            <p>{ticket.message}</p>
                                        </div>
                                        {/* <div className="float-end">
                                            <p>
                                                <span className="float-end">المجموع الجزئي : </span>
                                                <span className="fw-medium">
                                                    {order.totalPrice} {currency}
                                                </span>

                                            </p>
                                            <p>
                                                <span className="float-end"> التوصيل : </span>
                                                <span className="fw-medium">
                                                    {order?.shippingCost} {currency}
                                                </span>

                                            </p>
                                            {order?.discount &&
                                                <p>
                                                    <span className="fw-medium">الخصم</span>
                                                    <span className="float-end">
                                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                                        {order?.discount?.value}
                                                    </span>
                                                </p>
                                            }
                                            <h3>
                                                الإجمالي :
                                                {order?.finalPrice} {currency} </h3>
                                        </div>
                                        <div className="clearfix" /> */}
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    )}
                </Col>
            </Row>
        </>
    )
}

export default TicketDetails
