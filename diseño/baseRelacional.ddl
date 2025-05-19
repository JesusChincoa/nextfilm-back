-- Generado por Oracle SQL Developer Data Modeler 24.3.1.351.0831
--   en:        2025-05-19 12:54:35 CEST
--   sitio:      Oracle Database 11g
--   tipo:      Oracle Database 11g



-- predefined type, no DDL - MDSYS.SDO_GEOMETRY

-- predefined type, no DDL - XMLTYPE

CREATE TABLE Pelicula 
    ( 
     id              NUMBER  NOT NULL , 
     titulo          VARCHAR2 (50) , 
     genero          VARCHAR2 (50) , 
     director        VARCHAR2 (50) , 
     duracion        NUMBER , 
     estreno         DATE , 
     stock           NUMBER , 
     precio_alquiler NUMBER , 
     precio_venta    NUMBER , 
     descripcion     VARCHAR2 (500) 
    ) 
;

ALTER TABLE Pelicula 
    ADD CONSTRAINT Pelicula_PK PRIMARY KEY ( id ) ;

CREATE TABLE Prestamo 
    ( 
     pagado           CHAR (1) , 
     fecha            DATE , 
     fecha_devolucion DATE , 
     Usuario_id       NUMBER  NOT NULL , 
     Pelicula_id      NUMBER  NOT NULL 
    ) 
;

CREATE TABLE Usuario 
    ( 
     id       NUMBER  NOT NULL , 
     name     VARCHAR2 (50) , 
     isAdmin  CHAR (1) , 
     email    VARCHAR2 (50) , 
     password VARCHAR2 (50) 
    ) 
;

ALTER TABLE Usuario 
    ADD CONSTRAINT Usuario_PK PRIMARY KEY ( id ) ;

ALTER TABLE Prestamo 
    ADD CONSTRAINT Prestamo_Pelicula_FK FOREIGN KEY 
    ( 
     Pelicula_id
    ) 
    REFERENCES Pelicula 
    ( 
     id
    ) 
;

ALTER TABLE Prestamo 
    ADD CONSTRAINT Prestamo_Usuario_FK FOREIGN KEY 
    ( 
     Usuario_id
    ) 
    REFERENCES Usuario 
    ( 
     id
    ) 
;



-- Informe de Resumen de Oracle SQL Developer Data Modeler: 
-- 
-- CREATE TABLE                             3
-- CREATE INDEX                             0
-- ALTER TABLE                              4
-- CREATE VIEW                              0
-- ALTER VIEW                               0
-- CREATE PACKAGE                           0
-- CREATE PACKAGE BODY                      0
-- CREATE PROCEDURE                         0
-- CREATE FUNCTION                          0
-- CREATE TRIGGER                           0
-- ALTER TRIGGER                            0
-- CREATE COLLECTION TYPE                   0
-- CREATE STRUCTURED TYPE                   0
-- CREATE STRUCTURED TYPE BODY              0
-- CREATE CLUSTER                           0
-- CREATE CONTEXT                           0
-- CREATE DATABASE                          0
-- CREATE DIMENSION                         0
-- CREATE DIRECTORY                         0
-- CREATE DISK GROUP                        0
-- CREATE ROLE                              0
-- CREATE ROLLBACK SEGMENT                  0
-- CREATE SEQUENCE                          0
-- CREATE MATERIALIZED VIEW                 0
-- CREATE MATERIALIZED VIEW LOG             0
-- CREATE SYNONYM                           0
-- CREATE TABLESPACE                        0
-- CREATE USER                              0
-- 
-- DROP TABLESPACE                          0
-- DROP DATABASE                            0
-- 
-- REDACTION POLICY                         0
-- 
-- ORDS DROP SCHEMA                         0
-- ORDS ENABLE SCHEMA                       0
-- ORDS ENABLE OBJECT                       0
-- 
-- ERRORS                                   0
-- WARNINGS                                 0
