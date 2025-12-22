import { useState } from 'react'
import { Button, Card, CardBody, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

import PageMetaData from '@/components/PageTitle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

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



                                                <td>
                                                    <Button  onClick={() => navigate(`/brands/${brand.id || brand._id}/edit`)} variant="soft-secondary" size="sm" type="button" className="me-2">
                                                        <IconifyIcon icon="bx:edit" className="fs-16" />
                                                    </Button>
                                                    &nbsp; &nbsp;
                                                    <Button variant="soft-danger" size="sm" type="button"
                                                        onClick={() => handleDeleteClick(brand)}
                                                    >
                                                        <IconifyIcon icon="bx:trash" className="bx bx-trash fs-16" />
                                                    </Button>
                                                </td>
                           
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                           
                        </div>
                    </Card>
                </Col>
            </Row>


            <Modal show={!!selectedBrand} onHide={handleCloseModal} className="fade">
                <ModalHeader>
                    <Modal.Title>حذف علامة</Modal.Title>
                </ModalHeader>
                <ModalBody>
                    <p>
                        تأكيد حذف علامة : <strong>{selectedBrand?.name?.ar}</strong>
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
            </Modal>

        </>
    )
}

export default Brands