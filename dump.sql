--
-- PostgreSQL database dump
--

\restrict gM2K4edlE4lY9bQBz4s3Z9i3hTeWhVTaWYaby1bptnYSzrL91dAiFiIVYRzngsa

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: shaikyakoub
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO shaikyakoub;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: shaikyakoub
--

COMMENT ON SCHEMA public IS '';


--
-- Name: Role; Type: TYPE; Schema: public; Owner: shaikyakoub
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'ADMIN'
);


ALTER TYPE public."Role" OWNER TO shaikyakoub;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: shaikyakoub
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public."Account" OWNER TO shaikyakoub;

--
-- Name: Chapter; Type: TABLE; Schema: public; Owner: shaikyakoub
--

CREATE TABLE public."Chapter" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    "videoUrl" text,
    "position" integer NOT NULL,
    "isFree" boolean DEFAULT false NOT NULL,
    "isPublished" boolean DEFAULT false NOT NULL,
    "courseId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Chapter" OWNER TO shaikyakoub;

--
-- Name: Course; Type: TABLE; Schema: public; Owner: shaikyakoub
--

CREATE TABLE public."Course" (
    id text NOT NULL,
    "userId" text NOT NULL,
    title text NOT NULL,
    description text,
    "imageUrl" text,
    price double precision,
    "isPublished" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Course" OWNER TO shaikyakoub;

--
-- Name: Order; Type: TABLE; Schema: public; Owner: shaikyakoub
--

CREATE TABLE public."Order" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "courseId" text NOT NULL,
    amount double precision NOT NULL,
    "razorpayOrderId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Order" OWNER TO shaikyakoub;

--
-- Name: Progress; Type: TABLE; Schema: public; Owner: shaikyakoub
--

CREATE TABLE public."Progress" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "chapterId" text NOT NULL,
    "isCompleted" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Progress" OWNER TO shaikyakoub;

--
-- Name: Purchase; Type: TABLE; Schema: public; Owner: shaikyakoub
--

CREATE TABLE public."Purchase" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "courseId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Purchase" OWNER TO shaikyakoub;

--
-- Name: User; Type: TABLE; Schema: public; Owner: shaikyakoub
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text,
    email text NOT NULL,
    "emailVerified" timestamp(3) without time zone,
    image text,
    password text,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO shaikyakoub;

--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: shaikyakoub
--

COPY public."Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: Chapter; Type: TABLE DATA; Schema: public; Owner: shaikyakoub
--

COPY public."Chapter" (id, title, description, "videoUrl", "position", "isFree", "isPublished", "courseId", "createdAt", "updatedAt") FROM stdin;
cmi3ap2730002i1ecu6kutc48	chapter 1	booom	https://utfs.io/f/2SfFowy5NvZCfF2GUDkqAs7et2olvOQ5uwRnzbFaxgP4B68U	1	t	t	cmi3aivb10000i1ecfrr575q4	2025-11-17 15:24:16.096	2025-11-17 15:34:59.563
cmi3aq6jk0004i1ec7w2youfv	Chapter 2	boo	https://utfs.io/f/2SfFowy5NvZCYdTBxLg7hkPNGod4cvBLbiaU8lCRJ5njmspg	2	t	t	cmi3aivb10000i1ecfrr575q4	2025-11-17 15:25:08.385	2025-11-17 15:46:19.987
cmi3bpwvy0002i1mktt3s8yzh	noo	vbnm	https://utfs.io/f/2SfFowy5NvZCBifOfpVzFyCWfit57o2uBerhqPn0gLV8jRXA	1	f	t	cmi3bmvjc0000i1mkor9d5y1c	2025-11-17 15:52:55.486	2025-11-17 15:59:08.792
cmi3cqonz0002i19ck9iu5aj5	bbbb	\N	\N	1	t	f	cmi3ace7b0000i14sxipf4gx9	2025-11-17 16:21:31.103	2025-11-17 16:33:14.5
cmi3dpma90001i11w5wcaj86m	pom	m	https://utfs.io/f/2SfFowy5NvZClTeAquHRrxHvUsWbkc8io5Xn1ujamfwhq97g	1	f	t	cmi3cq2eh0000i19cg9u2ceku	2025-11-17 16:48:40.977	2025-11-17 16:49:39.792
cmi3gqybp0001i1hg7fqb4b8u	hifdsa	\N	\N	2	f	f	cmi3cq2eh0000i19cg9u2ceku	2025-11-17 18:13:42.085	2025-11-17 18:13:42.085
cmi4cyg8w0004i1pse0t6ld49	Chapter 1	free	https://utfs.io/f/2SfFowy5NvZCoXNH5dwHUSJB4Qm0x7d61Kup92nCwZLvtckI	1	t	t	cmi4crpug0002i1ps4rb1hijf	2025-11-18 09:15:19.616	2025-11-18 09:18:34.582
cmi4e76ra0003i1ckeojt45ru	a	a	https://utfs.io/f/2SfFowy5NvZC2aDx1y5NvZCTquM6lxjwDHKiIEP7JQG9Y0Sn	2	f	t	cmi4crpug0002i1ps4rb1hijf	2025-11-18 09:50:06.838	2025-11-18 09:50:52.824
cmi4e8ibm0005i1ckr1q59oes	Untitled Chapter	b	https://utfs.io/f/2SfFowy5NvZCuXstG27n3lcf4GsqtIjMd6O5zZ8CLQyxSr1A	3	f	t	cmi4crpug0002i1ps4rb1hijf	2025-11-18 09:51:08.483	2025-11-18 09:51:40.941
\.


--
-- Data for Name: Course; Type: TABLE DATA; Schema: public; Owner: shaikyakoub
--

COPY public."Course" (id, "userId", title, description, "imageUrl", price, "isPublished", "createdAt", "updatedAt") FROM stdin;
cmi3aivb10000i1ecfrr575q4	cmi1jxl7x0000i19ggxia1or7	Yoga	Yoga Description	https://cdn.pixabay.com/photo/2023/08/20/20/36/irish-setter-8203156_960_720.jpg	19.99	t	2025-11-17 15:19:27.227	2025-11-17 15:46:34.102
cmi3ace7b0000i14sxipf4gx9	cmi1jxl7x0000i19ggxia1or7	tre	\N	https://utfs.io/f/2SfFowy5NvZC90yvksBkKaqxtSIDwbpj3g90d5rOZHVEBCN4	987654	f	2025-11-17 15:14:25.124	2025-11-17 16:16:36.009
cmi3bmvjc0000i1mkor9d5y1c	cmi1jxl7x0000i19ggxia1or7	avs school	booring	https://utfs.io/f/2SfFowy5NvZCi0gyRmrFbJndQUDBkSoxgRj0YfWLG52MEc3p	99.99	t	2025-11-17 15:50:33.599	2025-11-17 16:18:49.708
cmi3cq2eh0000i19cg9u2ceku	cmi1jxl7x0000i19ggxia1or7	Untitled Course	\N	https://utfs.io/f/2SfFowy5NvZCXubPu6v186hioyGJe201Rjt9apO4IkuwLUWg	\N	f	2025-11-17 16:21:02.067	2025-11-17 18:11:43.229
cmi4crpug0002i1ps4rb1hijf	cmi3ab2460000i1icibjmhkbx	Boo Course	Boo Course Description	https://utfs.io/f/2SfFowy5NvZCN3Q8cZ90Wl5iUJ74RA1pwyIZqbxGzS8oFTHN	1	t	2025-11-18 09:10:05.465	2025-11-18 09:52:01.535
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: shaikyakoub
--

COPY public."Order" (id, "userId", "courseId", amount, "razorpayOrderId", "createdAt") FROM stdin;
cmi4evi230006i1ck60u8cknb	cmi3ab2460000i1icibjmhkbx	cmi3bmvjc0000i1mkor9d5y1c	99.99	order_RhAGxVL1qyeNZC	2025-11-18 10:09:01.228
\.


--
-- Data for Name: Progress; Type: TABLE DATA; Schema: public; Owner: shaikyakoub
--

COPY public."Progress" (id, "userId", "chapterId", "isCompleted", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Purchase; Type: TABLE DATA; Schema: public; Owner: shaikyakoub
--

COPY public."Purchase" (id, "userId", "courseId", "createdAt", "updatedAt") FROM stdin;
cmi4eydn80009i1ckyjj2s8vz	cmi3ab2460000i1icibjmhkbx	cmi4crpug0002i1ps4rb1hijf	2025-11-18 10:11:15.476	2025-11-18 10:11:15.476
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: shaikyakoub
--

COPY public."User" (id, name, email, "emailVerified", image, password, role, "createdAt", "updatedAt") FROM stdin;
cmi3ab2460000i1icibjmhkbx	Admin User	admin@krazycoders.com	\N	\N	$2b$12$9qOBN.ZzW7iuuf0CNIQ3l.qdmP0pV2Ijhf3ujzK4sGC0cJikGdFc.	ADMIN	2025-11-17 15:13:22.806	2025-11-17 15:13:22.806
cmi3k0ei10000i1lkz4i8nfl2	Shaik Shaheer Basha	sheikyaqoob@gmail.com	\N	\N	$2b$12$kBC3mlTB72KHLNgZMsh5W.DMeLysvMUQW.vVbR/fdj8bChFP4kf76	USER	2025-11-17 19:45:01.801	2025-11-17 19:45:01.801
cmi4boj7q0000i1pszijfiwpy	Yogi Vemana University	sheik@gmail.com	\N	\N	$2b$12$dMbfLJFiwgwUGDfK1IqYfOYiJ3MSK7dRNikdzaMN./QdM5lHR0dzS	USER	2025-11-18 08:39:37.286	2025-11-18 08:39:37.286
cmi4wt7v10000i1ew1gh4jamo	me	me@gmail.com	\N	\N	$2b$12$AJZomXU7X2HMEmsm/ug4heaM4qJpmFFYtCg5LRxNCDUVfdLINJvOK	USER	2025-11-18 18:31:07.79	2025-11-18 18:31:07.79
cmi4x890i0000i13ow1z96iol	me	mee@gmail.com	\N	\N	$2b$12$iSALlff1owYuj4G7iqXaPes3LmSrXPs6XHGATLcUrHaAvxSLKb4Uq	USER	2025-11-18 18:42:49.122	2025-11-18 18:42:49.122
\.


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: shaikyakoub
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: Chapter Chapter_pkey; Type: CONSTRAINT; Schema: public; Owner: shaikyakoub
--

ALTER TABLE ONLY public."Chapter"
    ADD CONSTRAINT "Chapter_pkey" PRIMARY KEY (id);


--
-- Name: Course Course_pkey; Type: CONSTRAINT; Schema: public; Owner: shaikyakoub
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: shaikyakoub
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: Progress Progress_pkey; Type: CONSTRAINT; Schema: public; Owner: shaikyakoub
--

ALTER TABLE ONLY public."Progress"
    ADD CONSTRAINT "Progress_pkey" PRIMARY KEY (id);


--
-- Name: Purchase Purchase_pkey; Type: CONSTRAINT; Schema: public; Owner: shaikyakoub
--

ALTER TABLE ONLY public."Purchase"
    ADD CONSTRAINT "Purchase_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: shaikyakoub
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Account_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: shaikyakoub
--

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" USING btree (provider, "providerAccountId");


--
-- Name: Chapter_courseId_idx; Type: INDEX; Schema: public; Owner: shaikyakoub
--

CREATE INDEX "Chapter_courseId_idx" ON public."Chapter" USING btree ("courseId");


--
-- Name: Order_razorpayOrderId_key; Type: INDEX; Schema: public; Owner: shaikyakoub
--

CREATE UNIQUE INDEX "Order_razorpayOrderId_key" ON public."Order" USING btree ("razorpayOrderId");


--
-- Name: Progress_chapterId_idx; Type: INDEX; Schema: public; Owner: shaikyakoub
--

CREATE INDEX "Progress_chapterId_idx" ON public."Progress" USING btree ("chapterId");


--
-- Name: Progress_userId_chapterId_key; Type: INDEX; Schema: public; Owner: shaikyakoub
--

CREATE UNIQUE INDEX "Progress_userId_chapterId_key" ON public."Progress" USING btree ("userId", "chapterId");


--
-- Name: Purchase_userId_courseId_key; Type: INDEX; Schema: public; Owner: shaikyakoub
--

CREATE UNIQUE INDEX "Purchase_userId_courseId_key" ON public."Purchase" USING btree ("userId", "courseId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: shaikyakoub
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: shaikyakoub
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Chapter Chapter_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: shaikyakoub
--

ALTER TABLE ONLY public."Chapter"
    ADD CONSTRAINT "Chapter_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Progress Progress_chapterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: shaikyakoub
--

ALTER TABLE ONLY public."Progress"
    ADD CONSTRAINT "Progress_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES public."Chapter"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Progress Progress_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: shaikyakoub
--

ALTER TABLE ONLY public."Progress"
    ADD CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Purchase Purchase_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: shaikyakoub
--

ALTER TABLE ONLY public."Purchase"
    ADD CONSTRAINT "Purchase_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Purchase Purchase_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: shaikyakoub
--

ALTER TABLE ONLY public."Purchase"
    ADD CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: shaikyakoub
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict gM2K4edlE4lY9bQBz4s3Z9i3hTeWhVTaWYaby1bptnYSzrL91dAiFiIVYRzngsa

