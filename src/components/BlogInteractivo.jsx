import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  TextField,
  InputAdornment,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DescriptionIcon from "@mui/icons-material/Description";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import * as XLSX from "xlsx";
import Catalogo from "./Catalogo.json";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import InicioSectionPlantillas from "./HomeComponents/InicioSectionPlantillas.jsx";

const NavigationBarDocs = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchText, setSearchText] = useState(
    () => sessionStorage.getItem("searchText") || ""
  );
  const [openGroup, setOpenGroup] = useState(null);
  const [openSector, setOpenSector] = useState({});
  const [selectedFicha, setSelectedFicha] = useState(() => {
    const stored = sessionStorage.getItem("selectedFicha");
    return stored ? JSON.parse(stored) : null;
  });

  const navigate = useNavigate();

  // Función para normalizar texto
  const normalize = (str = "") =>
    str
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  // Función para mostrar solo la parte posterior al guion bajo
  // Función para mostrar solo la parte posterior al guion bajo y reemplazar "_" por espacio
  const displayName = (name) =>
    (name.includes("_") ? name.split("_").slice(1).join("_") : name).replace(
      /_/g,
      " "
    );

  useEffect(() => {
    sessionStorage.setItem("searchText", searchText);
  }, [searchText]);

  // Filtrado de fichas
  const filteredData = useMemo(() => {
    const normalizedSearch = normalize(searchText);
    return Catalogo.filter((item) => {
      const cod = normalize(item.cod);
      const sector = normalize(item.sector);
      const grupo = normalize(item.grupo);
      return (
        !searchText ||
        cod.includes(normalizedSearch) ||
        sector.includes(normalizedSearch) ||
        grupo.includes(normalizedSearch)
      );
    });
  }, [searchText]);

  // Agrupamiento de fichas
  const groupedData = useMemo(() => {
    const grouped = {};
    filteredData.forEach((item) => {
      grouped[item.grupo] ??= {};
      grouped[item.grupo][item.sector] ??= [];
      grouped[item.grupo][item.sector].push(item);
    });

    // Ordenar por nombre completo
    const sortedGrouped = Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }))
      .reduce((acc, grupo) => {
        const sectores = grouped[grupo];
        const sortedSectores = Object.keys(sectores)
          .sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }))
          .reduce((accSec, sector) => {
            const sortedFichas = [...sectores[sector]].sort((a, b) =>
              a.cod.localeCompare(b.cod, "es", { sensitivity: "base" })
            );
            accSec[sector] = sortedFichas;
            return accSec;
          }, {});
        acc[grupo] = sortedSectores;
        return acc;
      }, {});

    return sortedGrouped;
  }, [filteredData]);

  const toggleGroup = (group) => {
    setOpenGroup(openGroup === group ? null : group);
    setOpenSector({});
  };

  const toggleSector = (group, sector) => {
    setOpenSector((prev) => ({
      ...prev,
      [group]: prev[group] === sector ? null : sector,
    }));
  };

  const handleFichaClick = async (ficha) => {
    try {
      setSelectedFicha(ficha);
      sessionStorage.setItem("selectedFicha", JSON.stringify(ficha));

      const filePath = `routers/${ficha.grupo}/${ficha.sector}/${ficha.cod}.xlsx`;
      const response = await fetch(filePath);
      if (!response.ok) throw new Error();

      const data = await response.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetsData = workbook.SheetNames.reduce((acc, sheetName) => {
        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          header: 1,
        });
        acc[sheetName] = sheet.filter((row) =>
          row.some((cell) => cell != null && cell !== "")
        );
        return acc;
      }, {});
      sessionStorage.setItem("excelData", JSON.stringify(sheetsData));

      setDrawerOpen(false);
      setOpenGroup(null);
      setOpenSector({});
      navigate("/doc");
    } catch (err) {
      console.error(err);
      toast.error("No se pudo cargar la ficha seleccionada.");
    }
  };

  return (
    <>
      {/* Botón lateral */}
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: 0,
          zIndex: 1300,
          transform: "translateY(-50%)",
        }}
      >
        <Button
          variant={drawerOpen ? "contained" : "outlined"}
          color="black"
          onClick={() => setDrawerOpen(!drawerOpen)}
          sx={{
            borderRadius: "0 8px 8px 0",
            height: 60,
            width: 62,
            minWidth: 62,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: (theme) => theme.palette.warning.main, // fondo naranja por defecto
            color: "white", // texto blanco por defecto
            border: `2px solid ${(theme) => theme.palette.warning.main}`, // borde opcional
            "&:hover": {
              backgroundColor: "transparent", // fondo transparente al hover
              color: (theme) => theme.palette.warning.main, // texto naranja al hover
              borderColor: (theme) => theme.palette.warning.main, // borde naranja al hover
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <FilterAltIcon sx={{ fontSize: 24 }} />
            <Typography sx={{ fontSize: 18, lineHeight: 1 }}>
              {drawerOpen ? "‹" : "›"}
            </Typography>
          </Box>
        </Button>
      </Box>

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 350, p: 2 } }}
      >
        <TextField
          fullWidth
          placeholder="Buscar plantilla..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterAltIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <List dense>
          {Object.entries(groupedData).map(([grupo, sectores]) => (
            <React.Fragment key={grupo}>
              <ListItemButton onClick={() => toggleGroup(grupo)}>
                {openGroup === grupo ? (
                  <ArrowDropDownIcon />
                ) : (
                  <ArrowRightIcon />
                )}
                <ListItemText primary={displayName(grupo)} />
              </ListItemButton>

              <Collapse in={openGroup === grupo}>
                {Object.entries(sectores).map(([sector, fichas]) => (
                  <React.Fragment key={sector}>
                    <ListItemButton
                      sx={{ pl: 4 }}
                      onClick={() => toggleSector(grupo, sector)}
                    >
                      {openSector[grupo] === sector ? (
                        <ArrowDropDownIcon />
                      ) : (
                        <ArrowRightIcon />
                      )}
                      <ListItemText primary={displayName(sector)} />
                    </ListItemButton>

                    <Collapse in={openSector[grupo] === sector}>
                      {fichas.map((f) => (
                        <ListItemButton
                          key={f.cod}
                          sx={{ pl: 8 }}
                          onClick={() => handleFichaClick(f)}
                        >
                          <DescriptionIcon sx={{ mr: 1 }} />
                          <ListItemText primary={displayName(f.cod)} />
                        </ListItemButton>
                      ))}
                    </Collapse>
                  </React.Fragment>
                ))}
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </Drawer>

      <Box mb={5}></Box>

      {/* Contenido principal */}
      <Box sx={{ ml: { xs: 0 }, p: 2 }}>
        <InicioSectionPlantillas />

        <Container>
          {Object.entries(groupedData).map(([grupo, sectores]) => (
            <Box key={grupo} sx={{ mb: 4 }}>
              {Object.entries(sectores).map(([sector, fichas]) => (
                <Box key={sector} sx={{ mb: 2 }}>
                  <Typography
                    sx={{
                      textTransform: "uppercase",
                      color: "darkblue",
                      textAlign: "center",
                      mb: 1,
                    }}
                  >
                    {displayName(grupo)} - {displayName(sector)}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      overflowX: "auto",
                      gap: 1,
                      scrollBehavior: "smooth",
                      pb: 2,
                      px: 1,
                      flexWrap: "nowrap",
                      "&::-webkit-scrollbar": { height: 6 },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "darkblue",
                        borderRadius: 4,
                      },
                      "&::-webkit-scrollbar-track": {
                        backgroundColor: "#e0f7fa",
                      },
                    }}
                  >
                    {fichas.map((ficha) => (
                      <Card
                        key={ficha.cod}
                        sx={{
                          flex: { xs: "0 0 103%", sm: "0 0 48%" },
                          minWidth: { xs: "103%", sm: "48%" },
                          borderRadius: "12px",
                          overflow: "hidden",
                          backgroundColor: "#fff",
                          border: "2px solid darkblue",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          transition: "all 0.3s ease",
                          position: "relative",
                          cursor: "pointer",
                          "&:hover": {
                            transform: "scale(1.03)",
                            borderColor: "darkblue",
                            boxShadow: "0 6px 18px rgba(0, 0, 139, 0.15)",
                          },
                        }}
                        onClick={() => handleFichaClick(ficha)}
                      >
                        <Box
                          sx={{
                            position: "relative",
                            width: "100%",
                            paddingTop: "55%",
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={`/routers/${encodeURIComponent(
                              ficha.grupo
                            )}/${encodeURIComponent(
                              ficha.sector
                            )}/${encodeURIComponent(ficha.cod)}.png`}
                            alt={ficha.cod}
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              backgroundColor: "#fafafa",
                            }}
                            onError={(e) =>
                              (e.currentTarget.src = "/img/defecto.png")
                            }
                          />
                        </Box>

                        <Button
                          variant="outlined"
                          sx={{
                            position: "absolute",
                            top: "2%",
                            right: "-2%",
                            transform: "translateX(-50%)",
                            borderRadius: "6px",
                            overflow: "hidden",
                            borderColor: "transparent",
                            color: "darkblue",
                            padding: 0.2,
                            minWidth: "auto",
                            textTransform: "none",
                            transition: "all .25s ease",
                            "&:hover": {
                              backgroundColor: "darkblue",
                              color: "#fff",
                              borderColor: "darkblue",
                            },
                          }}
                          onClick={() => handleFichaClick(ficha)}
                        >
                          <NoteAltOutlinedIcon sx={{ fontSize: 30 }} />
                        </Button>
                      </Card>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          ))}
        </Container>
      </Box>
    </>
  );
};

export default NavigationBarDocs;
