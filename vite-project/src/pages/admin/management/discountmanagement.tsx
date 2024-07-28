import { useFetchData } from "6pp";
import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Skeleton } from "../../../components/loader";
import { SingleDiscountResponse } from "../../../types/api-types";
import { UserReducerInitialState } from "../../../redux/reducer-types";
import { server } from "../../../redux/store";

const DiscountManagement = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) =>
      state.userReducer
  );
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    loading: isLoading,
    data,
    error: fetchError,
  } = useFetchData<SingleDiscountResponse>(
    `${server}/api/v1/payment/coupon/${id}?id=${user?._id}`,
    "discount-code"
  );

  useEffect(() => {
    if (fetchError) {
      toast.error(fetchError);
    }
  }, [fetchError]);

  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [code, setCode] = useState("");
  const [amount, setAmount] = useState(0);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  setBtnLoading(true);

  try {
    const { data } = await axios.put(
      `${server}/api/v1/payment/coupon/${id}?id=${user?._id}`,
      {
        code,
        amount,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    if (data.success) {
      setAmount(0);
      setCode("");
      toast.success(data.message);
      navigate("/admin/discount");
    }
  } catch (error) {
    if (error.response) {
      console.error('Server Error:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      toast.error(`Server Error: ${error.response.data.message}`);
    } else if (error.request) {
      console.error('Request Error:', error.request);
      toast.error('Request Error: No response received from server.');
    } else {
      console.error('General Error:', error.message);
      toast.error('General Error: Failed to send request.');
    }
  } finally {
    setBtnLoading(false);
  }
};

  const deleteHandler = async () => {
    setBtnLoading(true);

    try {
      const { data } = await axios.delete(
        `${server}/api/v1/payment/coupon/${id}?id=${user?._id}`,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/admin/discount");
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error('Failed to delete coupon. Please try again later.');
    } finally {
      setBtnLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      setCode(data.coupon.code);
      setAmount(data.coupon.amount);
    }
  }, [data]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            <article>
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <form onSubmit={submitHandler}>
                <h2>Manage</h2>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>

                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                </div>

                <button disabled={btnLoading} type="submit">
                  Update
                </button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};
export default DiscountManagement;