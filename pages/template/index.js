import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import style from "../template/template.module.css";
import SubTemplate from "./subTemplate/SubTemplate";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_TEMPLATE, GET_TEMPLATE_LIST } from "@/query/query";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import LoadingSpin from "react-loading-spin";
import "react-toastify/dist/ReactToastify.css";
import DeletePopup from "@/component/confirmationPopup/DeletePopup";

function TemplatePage(props) {
  const [open, setOpen] = useState(false);
  const [deleteTemp, setDeleteTemp] = useState(false);
  const [deleteID, setDeleteID] = useState();

  const {
    data: tempData,
    loading: loadingTempData,
    refetch: refetchTempData,
  } = useQuery(GET_TEMPLATE_LIST, {});

  const [templateData, setTemplateData] = useState([]);

  const handleOpration = (type, msg) => {
    if (type === "success") {
      toast.success(msg);
      refetchTempData();
    } else {
      toast.error(msg);
    }
  };

  const [deleteTemplate] = useMutation(DELETE_TEMPLATE, {
    onCompleted(proxy, result) {
      if (proxy.deleteTemplate.msg.message) {
        handleOpration("success", proxy.deleteTemplate.msg.message);
      } else {
        handleOpration("error", proxy.deleteTemplate.msg.error);
      }
    },
    onError(err) {
      handleOpration("error", err.message);
    },
  });

  useEffect(() => {
    if (!loadingTempData && tempData?.getAllTemplateData.length > 0) {
      setTemplateData(tempData?.getAllTemplateData);
    }
  }, [loadingTempData, tempData]);

  const handleModel = (value) => {
    setOpen(value);
  };

  const deleteTemplateFun = () => {
    deleteTemplate({
      variables: {
        templateId: deleteID,
      },
    });
    setDeleteID();
  };

  return (
    <div className={style.templateContainer}>
      {deleteTemp && (
        <DeletePopup
          deleteTemp={deleteTemp}
          setDeleteTemp={setDeleteTemp}
          deleteTemplateFun={deleteTemplateFun}
        />
      )}
   
      <ToastContainer />
      <Box className={style.add}>
        <Button
          className={style.btnAdd}
          variant="outlined"
          onClick={() => handleModel(true)}
        >
          Add Template
        </Button>
        <Dialog
          open={open}
          onClose={handleModel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Add Template"}</DialogTitle>
          <DialogContent>
            <SubTemplate
              handleModel={handleModel}
              data={{}}
              handleOpration={handleOpration}
            />
          </DialogContent>
        </Dialog>
      </Box>
      {templateData.length > 0 ? (
        <Box className={style.templateBox}>
          {templateData.map((itm, index) => {
            return (
              <Link
                key={`link_${index}`}
                className={style.cardTemp}
                href={{
                  pathname: `/template/${itm.TemplateName}`,
                  query: { id: itm.TemplateId },
                }}
              >
                <Card sx={{ boxShadow: "none" }}>
                  <CardContent>
                    <Typography
                      sx={{
                        fontSize: 20,
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                      color="text.secondary"
                      gutterBottom
                    >
                      {itm.TemplateTitle}
                      <AiOutlineCloseCircle
                        style={{ float: "right", color: "red", zoom: 1.2 }}
                        onClick={(e) => {
                          setDeleteTemp(true);
                          e.preventDefault();
                          setDeleteID(itm.TemplateId);
                        }}
                      />
                    </Typography>
                    <Typography sx={{ float: "left" }}>Fields :</Typography>
                    <br></br>
                    <br></br>
                    <Divider></Divider>
                    <ul>
                      {itm?.TemplateField?.map((item, index) => (
                        <li key={`li_${index}`} id={style.listItm}>
                          {item.title}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </Box>
      ) : (
        <Box className={style.noFound}>
          <LoadingSpin />
        </Box>
      )}
    </div>
  );
}

export default TemplatePage;
