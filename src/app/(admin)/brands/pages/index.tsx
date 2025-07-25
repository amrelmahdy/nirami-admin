import { useState } from 'react'
import { Button, Card, CardBody, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

import PageMetaData from '@/components/PageTitle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { useGetCategories } from '../../categories/categories.hooks'
import { Brand, useDeleteBrand, useGetBrands } from '../brands.hooks'

const Brands = () => {

    const navigate = useNavigate();


    const { data: brandsList, isError, isLoading } = useGetBrands();


    const [selectedBrand, setselectedBrand] = useState<Brand | undefined>(undefined);


    const deleteBrand = useDeleteBrand();


    const handleDeleteClick = (brand: Brand) => {
        setselectedBrand(brand);
    };

    const handleCloseModal = () => {
        setselectedBrand(undefined);
    };


    const handleDeleteModal = (id: string) => {
        deleteBrand.mutate(id)
        handleCloseModal();
    };


    return (
        <>
            <PageMetaData title="العلامات التجارية" />

            {isLoading && <Spinner />}

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
                                <div>
                                    <Button onClick={() => navigate("/brands/create")} variant="success">
                                        <IconifyIcon icon="bx:plus" className="me-1" />
                                        إضافة علامة تجارية
                                    </Button>
                                </div>
                            </div>
                        </CardBody>
                        <div>
                            <div className="table-responsive table-centered">
                                <table className="table text-nowrap mb-0">
                                    <thead className="bg-light bg-opacity-50">
                                        <tr>
                                            {/* <th className="border-0 py-2">رمز المنتج</th> */}
                                            <th className="border-0 py-2">الصورة</th>
                                            <th className="border-0 py-2">الإسم بالعربية</th>
                                            <th className="border-0 py-2">الإسم بالإنجحليزية</th>
                                            <th className="border-0 py-2">تاريخ الإنشاء</th>
                                            {/* 
                      <th className="border-0 py-2">القسم</th>
                      <th className="border-0 py-2">الفئة</th>
                      <th className="border-0 py-2">المجموعة</th>
                      <th className="border-0 py-2">السعر</th>
                      <th className="border-0 py-2">المخزون</th>
                      <th className="border-0 py-2"> الحالة</th> */}
                                            <th className="border-0 py-2">إجراء</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!isError && !isLoading && brandsList?.map((brand: Group, idx) => (
                                            <tr key={idx}>
                                                {/* <td>
                          <Link to={`/departments/${department.id}`} className="fw-medium">
                            #{department.id}
                          </Link>
                        </td> */}

                                                <td>
                                                    <img src={brand.image} alt="user-img" className="avatar-md rounded-circle me-2" />
                                                </td>

                                                <td>
                                                    <div>
                                                        <h5 className="fs-14 mt-1 fw-normal">{brand.name?.ar}</h5>
                                                    </div>
                                                </td>


                                                <td>
                                                    <div>
                                                        <h5 className="fs-14 mt-1 fw-normal">{brand.name?.en}</h5>
                                                    </div>
                                                </td>

                                                <td> {brand.createdAt && new Date(brand.createdAt).toDateString()}</td>


                                                <td>
                                                    <Button  onClick={() => navigate(`/brands/${brand.id || brand._id}/edit`)} variant="soft-secondary" size="sm" type="button" className="me-2">
                                                        <IconifyIcon icon="bx:edit" className="fs-16" />
                                                    </Button>
                                                    <Button variant="soft-danger" size="sm" type="button"
                                                        onClick={() => handleDeleteClick(brand)}
                                                    >
                                                        <IconifyIcon icon="bx:trash" className="bx bx-trash fs-16" />
                                                    </Button>
                                                </td>
                                                {/* 
                        <td>
                          <div className="d-flex align-items-center">
                            {invoice.customer && <img src={invoice.customer.image} alt="user-img" className="avatar-xs rounded-circle me-2" />}
                            <div>
                              <h5 className="fs-14 mt-1 fw-normal">{invoice.customer?.name}</h5>
                            </div>
                          </div>
                        </td>
                        <td>{invoice.customer && new Date(invoice.customer?.createdAt).toDateString()}&nbsp;</td>
                        <td> {invoice.order && new Date(invoice.order?.createdAt).toDateString()}</td>
                        <td>
                          {currency}
                          {invoice.product?.price}
                        </td>
                        <td>
                          <span
                            className={`badge badge-soft-${invoice.order?.status === 'Cancelled' ? 'danger' : invoice.order?.status == 'Processing' ? 'warning' : 'success'}`}>
                            {invoice.order?.status}
                          </span>
                        </td>
                        <td>{invoice.order?.paymentMethod}</td>
                        <td>
                          <Button variant="soft-secondary" size="sm" type="button" className="me-2">
                            <IconifyIcon icon="bx:edit" className="fs-16" />
                          </Button>
                          <Button variant="soft-danger" size="sm" type="button">
                            <IconifyIcon icon="bx:trash" className="bx bx-trash fs-16" />
                          </Button>
                        </td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="align-items-center justify-content-between row g-0 text-center text-sm-start p-3 border-top">
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
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>


            {/* <Modal show={!!selectedBrand} onHide={handleCloseModal} className="fade">
                <ModalHeader>
                    <Modal.Title>ؤحذف قسم</Modal.Title>
                </ModalHeader>
                <ModalBody>
                    <p>
                        تأكيد حذف مجموعة : <strong>{selectedBrand?.name?.ar}</strong>
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        إلغاء
                    </Button>
                    <Button variant="danger" onClick={() => {
                        handleDeleteModal(selectedBrand?.id as string);
                    }}>
                        تأكيد الحذف
                    </Button>
                </ModalFooter>
            </Modal> */}

        </>
    )
}

export default Brands



// @Prop({ type: Object })
// name: Record<string, string>;

// @Prop({ type: Object })
// description: Record<string, string>;

// @Prop({ type: Object })
// components: Record<string, string>;

// @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true })
// brand: Brand;

// @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true })
// group: Brand;

// @Prop({ required: true })
// price: number;

// @Prop({ required: true })
// salesPrice: number;

// @Prop({ default: 0 })
// maxQuantity: number

// @Prop({ default: 0 })
// stock: number;

// @Prop()
// sku: string;

// @Prop({ default: 5 })
// averageRating: number;

// @Prop({ default: 0 })
// reviewCount: number;

// @Prop({ default: getDefaultImagePath })
// productCardImage: string

// @Prop({ default: [] })
// images: Image[];

// @Prop({ default: false })
// isOutOfStock: boolean;


// @Prop({ default: false })
// isOnSale: boolean;

// @Prop({ default: false })
// isFeatured: boolean;

// @Prop({ default: false })
// isPublished: boolean;