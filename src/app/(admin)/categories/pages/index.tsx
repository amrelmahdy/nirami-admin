import { useState } from 'react'
import { Button, Card, CardBody, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

import PageMetaData from '@/components/PageTitle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { useDeleteDepartment } from '../../departments/departments.hooks'
import { Category, useDeleteCategory, useGetCategories } from '../categories.hooks'

const Categories = () => {

    const navigate = useNavigate();


    const { data: categoriesList, isError, isLoading } = useGetCategories();


    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);


    const deleteCategory = useDeleteCategory();


    const handleDeleteClick = (category: Category) => {
        setSelectedCategory(category);
    };

    const handleCloseModal = () => {
        setSelectedCategory(undefined);
    };


    const handleDeleteModal = (id: string) => {
        deleteCategory.mutate(id)
        handleCloseModal();
    };


    return (
        <>
            <PageMetaData title="الفئات" />

            {isLoading && <Spinner />}

            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <div className="d-flex flex-wrap justify-content-between gap-3">
                                <div>
                                    <Button onClick={() => navigate("/categories/create")} variant="success">
                                        <IconifyIcon icon="bx:plus" className="me-1" />
                                        إضافة فئة
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
                                            <th className="border-0 py-2">القسم</th>
                                            <th className="border-0 py-2">إجراء</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!isError && !isLoading && categoriesList?.map((category: Category, idx) => (
                                            <tr key={idx}>
                                                <td>
                                                    <img src={category.image} alt="user-img" className="avatar-md rounded-circle me-2" />
                                                </td>

                                                <td>
                                                    <div>
                                                        <h5 className="fs-14 mt-1 fw-normal">{category.name?.ar}</h5>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <h5 className="fs-14 mt-1 fw-normal">{category.name?.en}</h5>
                                                    </div>
                                                </td>

                                                <td>
                                                    <div>
                                                        <h5 className="fs-14 mt-1 fw-normal">{category.department?.name?.ar}</h5>
                                                    </div>
                                                </td>



                                                <td>
                                                    <Button onClick={() => navigate(`/categories/${category.id || category._id}/edit`)} variant="soft-secondary" size="sm" type="button" className="me-2">
                                                        <IconifyIcon icon="bx:edit" className="fs-16" />
                                                    </Button>
                                                    &nbsp; &nbsp;
                                                    <Button variant="soft-danger" size="sm" type="button"
                                                        onClick={() => handleDeleteClick(category)}
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


            <Modal show={!!selectedCategory} onHide={handleCloseModal} className="fade">
                <ModalHeader>
                    <Modal.Title>تأكيد الحذف</Modal.Title>
                </ModalHeader>
                <ModalBody>
                    <p>
                        تأكيد حذف فئة : <strong>{selectedCategory?.name?.ar}</strong>
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        إلغاء
                    </Button>
                    <Button variant="danger" onClick={() => {
                        handleDeleteModal(selectedCategory?.id as string);
                    }}>
                        تأكيد الحذف
                    </Button>
                </ModalFooter>
            </Modal>

        </>
    )
}

export default Categories



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