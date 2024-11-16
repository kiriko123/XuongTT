import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin, notification } from 'antd';
import * as web3 from '@solana/web3.js';
import { Buffer } from 'buffer';

// Đảm bảo rằng Buffer được định nghĩa cho trình duyệt
window.Buffer = Buffer;

const PhantomCheckoutModal = ({ isModalVisible, setIsModalVisible, amount, onPaymentSuccess }) => {
    const [isPaying, setIsPaying] = useState(false);
    const [phantomProvider, setPhantomProvider] = useState(null);

    useEffect(() => {
        const detectPhantomProvider = () => {
            if ('solana' in window) {
                const provider = window.solana;
                if (provider.isPhantom) {
                    setPhantomProvider(provider);
                } else {
                    notification.error({
                        message: "Ví không được hỗ trợ",
                        description: "Vui lòng cài đặt ví Phantom."
                    });
                }
            }
        };

        detectPhantomProvider();
    }, []);

    const handlePhantomPayment = async () => {
        if (!phantomProvider) {
            notification.error({
                message: "Không tìm thấy ví Phantom",
                description: "Vui lòng cài đặt ví Phantom và thử lại."
            });
            return;
        }

        setIsPaying(true);
        try {
            await phantomProvider.connect();
            const connection = new web3.Connection(web3.clusterApiUrl('testnet'));
            const { publicKey } = phantomProvider;

            // Kiểm tra số dư
            const balance = await connection.getBalance(publicKey);
            if (balance < web3.LAMPORTS_PER_SOL * amount) {
                notification.error({
                    message: "Số dư không đủ",
                    description: "Ví không đủ SOL cho giao dịch này."
                });
                return;
            }

            // Tạo và gửi giao dịch
            const transaction = new web3.Transaction().add(
                web3.SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: new web3.PublicKey('C6cDDxP9vrZqDaJr8nqpxsXE7kTgsB7cAt2y2VvneCkx'), // Thay bằng địa chỉ của bạn
                    lamports: web3.LAMPORTS_PER_SOL * amount
                })
            );

            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = publicKey;

            const signedTransaction = await phantomProvider.signTransaction(transaction);
            const signature = await connection.sendRawTransaction(signedTransaction.serialize());

            await connection.confirmTransaction(signature);
            notification.success({
                message: "Thanh toán thành công",
                description: `ID giao dịch: ${signature}`
            });
            onPaymentSuccess();
        } catch (error) {
            notification.error({
                message: "Thanh toán thất bại",
                description: error.message || "Đã xảy ra lỗi trong quá trình thanh toán"
            });
            console.error("Chi tiết lỗi:", error);
        } finally {
            setIsPaying(false);
            setIsModalVisible(false);
        }
    };

    return (
        <Modal
            title="Thanh toán qua ví Phantom"
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
        >
            <p>Bạn đang thực hiện thanh toán {amount} SOL (testnet)</p>
            <Button
                type="primary"
                onClick={handlePhantomPayment}
                disabled={isPaying}
            >
                {isPaying ? <Spin /> : 'Xác nhận thanh toán'}
            </Button>
        </Modal>
    );
};

export default PhantomCheckoutModal;
