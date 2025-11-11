import { useEffect, useState } from "react";
import { Button, DatePicker, Descriptions, Form, Input, Modal, Popconfirm, Table } from "antd";
import dayjs from 'dayjs'
import { 
    CalendarOutlined, 
    DeleteOutlined, 
    EditOutlined, 
    EyeOutlined, 
    FileAddOutlined, 
    HomeOutlined, 
    MailOutlined, 
    UserAddOutlined 
} from "@ant-design/icons"
import { toast } from "react-toastify";
const ManagerUser = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm()
    const [employees, setEmployees] = useState([]);
    const [empId, setEmpId] = useState(null);
    const [isModalViewDetail, setIsModalViewDetail] = useState(false)
    const [dataView, setDataView] = useState(null)
    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('data')) || [];
            setEmployees(saved);
        } catch (error) {
            console.error('Error loading data:', error);
            setEmployees([]);
        }
    }, []);

    const handleCreate = () => {
        setIsModalVisible(true);
    }    

    const handleSubmit = (value) => {
        const id = Date.now()
        const newUser= {
                id: empId || id,
                name: value.name,
                dob: dayjs(value.dob).format("DD/MM/YYYY"),
                email: value.email,
                address:value.address
            }
        let newData
        
        if(empId) {
            newData = employees.map(items => items.id === empId ? newUser : items)
            toast.success("Cập nhật nhân viên thành công!");
        } else {
            if (employees.some(emp => emp.email === value.email)) {
                toast.error('Email đã tồn tại!');
                return;
            }
            newData = [...employees, newUser]
            toast.success("Thêm nhân viên thành công!");
        }
        localStorage.setItem("data",JSON.stringify(newData))
        setEmployees(newData)
        
        form.resetFields()
        setEmpId(null);
        setIsModalVisible(false)

    }

    const handleOnCancel = () => {
        form.resetFields()
        setIsModalVisible(false)
        setEmpId(null)
    }   

    const handleDelete = (id) => {
        const updated = employees.filter(item => item.id !== id);
        localStorage.setItem("data", JSON.stringify(updated));
        setEmployees(updated);
        toast.success('Đã xóa nhân viên thành công!');
          
    };

    const handleUpdate = (value) => {
        setEmpId(value.id)
       
        form.setFieldsValue({
            name: value.name,
            email: value.email,
            address:value.address,
            dob: dayjs(value.dob, "DD/MM/YYYY"),
        })

        setIsModalVisible(true)
    }

    const handleView = (value) => {
        if (!value) return;
        setIsModalViewDetail(true)
        const dataDetail = {
            id: value?.id,
            name: value?.name,
            dob: value?.dob,
            email: value?.email,
            address: value?.address
        }
        setDataView(dataDetail)
    }

    const handleOnCancelModalViewDetail = () => {
        setIsModalViewDetail(false)
    }
    
    const columns = [
        {
            title: 'STT',
            key: 'stt',
            render: (_,__,index) => index + 1
        },
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortDirections: ["ascend", "descend"]
        },
        {
            title: 'Date of Birth',
            dataIndex: 'dob',
            key: 'dob',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            sorter: (a, b) => a.address.localeCompare(b.address), // Fix từ a.name thành a.address
            sortDirections: ["ascend", "descend"]
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div style={{
                    display: " flex",
                    gap: "10px"
                }}>
                    <Popconfirm
                        title="Xác nhận xóa"
                        description="Bạn có chắc chắn muốn xóa nhân viên này không?"
                        okText="Xóa"
                        cancelText="Hủy"
                        danger
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button danger><DeleteOutlined />Xóa</Button>
                    </Popconfirm>
                    <Button ghost  type="primary" onClick={() => handleUpdate(record)}>
                        <EditOutlined />Sửa
                    </Button>
                    <Button onClick={() => handleView(record)}>
                        <EyeOutlined />Chi tiết
                    </Button>

                </div>
            )
        }
    ]

    return(
        <div>
            <div>
                <h1>
                    Quản lý nhân viên
                </h1>
                <div>
                    <button 
                        style={{
                            backgroundColor: 'green', 
                            color: 'white', 
                            padding: '10px', 
                            borderRadius: '5px', 
                            border: 'none', 
                            cursor: 'pointer',
                            height: '40px',
                            marginBottom: '20px',
                            width: '150px',
                            display: "flex",
                            gap: "5px",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        onClick={() => handleCreate()}
                    >
                        <FileAddOutlined />Thêm nhân viên
                    </button>
                </div>
            </div>
            <Table 
                columns={columns}
                dataSource={employees}
                pagination={false}
                rowKey={(record) => record.id || record.email}
            />
            <Modal
                title={
                    empId ? "Chỉnh sửa thông tin nhân viên" : "Thêm nhân viên"
                }
                onCancel={handleOnCancel}
                open={isModalVisible}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    style={{ maxWidth: 500, margin: 'auto', padding: 24 }}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên!' }]}
                    >
                        <Input placeholder="Nhập tên" style={{ height: 40 }} />
                    </Form.Item>

                    <Form.Item
                        label="Date of Birth"
                        name="dob"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                        >
                        <DatePicker
                            style={{ width: "100%", height: 40 }}
                            format="DD/MM/YYYY"
                            placeholder="Chọn ngày sinh: DD/MM/YYYY"
                            disabledDate={(current) => current && current > dayjs().endOf('day')}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' },
                        ]}
                    >
                        <Input placeholder="example@gmail.com" style={{ height: 40 }} />
                    </Form.Item>

                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                    >
                        <Input placeholder="Nhập địa chỉ" style={{ height: 40 }} />
                    </Form.Item>

                    <Form.Item>
                        
                            <Button type="primary" htmlType="submit"
                                style={{
                                    height: "40px",
                                        
                                }}
                            >
                                { empId ? "Sửa" :  "Thêm mới" }
                            </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Thông tin chi tiết của nhân viên."
                open={isModalViewDetail}
                onCancel={handleOnCancelModalViewDetail}
                footer={null}
            >
                {dataView && (
                    <>
                        <Descriptions 
                            column={1} 
                            size="middle"
                            colon={false}
                            labelStyle={{ width: 100, fontWeight: 600, color: '#334155' }}
                            contentStyle={{ color: '#1e293b' }}
                        >
                            <Descriptions.Item label={<><UserAddOutlined /> &nbsp;Họ tên:</>}>
                                {dataView?.name || 'Chưa có thông tin'}
                            </Descriptions.Item>
                            <Descriptions.Item label={<><CalendarOutlined /> &nbsp;Ngày sinh:</>}>
                                {dataView?.dob || 'Chưa có thông tin'}
                            </Descriptions.Item>
                            <Descriptions.Item label={<><MailOutlined /> &nbsp;Email:</>}>
                                {dataView?.email || 'Chưa có thông tin'}
                            </Descriptions.Item>
                            <Descriptions.Item label={<><HomeOutlined /> &nbsp;Địa chỉ:</>}>
                                {dataView?.address || 'Chưa có thông tin'}
                            </Descriptions.Item >
                        </Descriptions>
                    </>
                )}
            </Modal>
        </div>
    )
}
export default ManagerUser;